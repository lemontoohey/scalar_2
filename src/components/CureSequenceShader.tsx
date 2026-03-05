'use client';
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3500

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSpeed;
  
  varying vec2 vUv;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    // Rotate to reduce axial bias
    mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
    float f = 0.0;
    f += 0.500 * smoothNoise(p); p *= m * 2.02;
    f += 0.250 * smoothNoise(p); p *= m * 2.03;
    f += 0.125 * smoothNoise(p);
    return f / 0.9375;
  }
  
  void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      
      // TIGHTENED SPREAD: Reduced singularity
      float singularity = 1.0 - smoothstep(0.05, 0.32, dist); // Expanded slightly for 'lungs'
  
      // DOMAIN WARPING (The Soul)
      // Instead of simple noise, we warp the coordinate space recursively.
      vec2 q = vec2(0.);
      q.x = fbm(vUv * 2.0 + 0.1 * uTime * uSpeed);
      q.y = fbm(vUv * 2.0 + vec2(1.0));
  
      vec2 r = vec2(0.);
      r.x = fbm(vUv * 2.0 + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime * uSpeed);
      r.y = fbm(vUv * 2.0 + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime * uSpeed);
  
      float f = fbm(vUv + r);
      
      // Deep red biologic tint (SCALAR RED: ~0.65 red, low green/blue)
      // Darker, richer base than before
      vec3 baseColor = vec3(0.1, 0.0, 0.0); // Void
      vec3 bloodColor = vec3(0.5, 0.02, 0.05); // Oxygenated
      vec3 hotColor = vec3(1.0, 0.9, 0.8); // White Heat
  
      // Color mixing based on warping density
      vec3 finalColor = mix(baseColor, bloodColor, clamp((f*f)*4.0, 0.0, 1.0));
      finalColor = mix(finalColor, hotColor, clamp(length(q) - 0.2, 0.0, 1.0) * smoothstep(0.0, 0.5, uProgress));
  
      // Ignition Intensity
      // During ignition, the warp drives the light intensity
      float ignitionHeat = smoothstep(0.0, 0.4, uProgress) * (1.0 - smoothstep(0.5, 1.0, uProgress));
      finalColor += hotColor * ignitionHeat * f;
  
      float alpha = singularity * (f * 1.5 + 0.2);
      
      // Recession Fade
      float recession = 1.0 - smoothstep(0.6, 1.0, uProgress);
      alpha *= recession;
  
      gl_FragColor = vec4(finalColor, alpha);
  }
`

// Easing: sineOut (smooth start), exponentialIn (recession)
function easeSineOut(t: number) {
  return Math.sin((t * Math.PI) / 2)
}

function easeExponentialIn(t: number) {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1))
}

function InnerShader({
  onCureComplete,
}: {
  onCureComplete?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const startTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const cureCompleteFired = useRef(false)
  const planeWidth = Math.max(viewport.width, 10)
  const planeHeight = Math.max(viewport.height, 10)

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSpeed: { value: 0.1 },
    }),
    []
  )

  useFrame((_state, delta) => {
    if (startTimeRef.current === null) startTimeRef.current = 0
    elapsedRef.current += delta
    const elapsedMs = elapsedRef.current * 1000
    const rawProgress = Math.min(elapsedMs / DURATION_MS, 1)

    // Phase A (0–44%): sineOut expansion. Phase B (44–100%): exponentialIn recession.
    const phaseSplit = 0.444 
    let eased = 0
    if (rawProgress < phaseSplit) {
      const t = rawProgress / phaseSplit
      eased = phaseSplit * easeSineOut(t)
    } else {
      const t = (rawProgress - phaseSplit) / (1 - phaseSplit)
      eased = phaseSplit + (1 - phaseSplit) * easeExponentialIn(t)
    }

    if (rawProgress >= 1 && !cureCompleteFired.current) {
      cureCompleteFired.current = true
      onCureComplete?.()
    }

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.uTime.value = elapsedRef.current
        material.uniforms.uProgress.value = eased
        material.uniforms.uSpeed.value = 0.1
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function CureSequenceShader() {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <InnerShader />
      </Canvas>
    </div>
  )
}
