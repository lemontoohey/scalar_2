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
      
      // SOFT MIST EDGE:
      // Solid in middle (0.0 to 0.3), Soft Fade (0.3 to 0.5), Invisible (> 0.5)
      // This turns the square plane into a misty sphere of influence.
      float softEdge = 1.0 - smoothstep(0.3, 0.6, dist);
  
      // Re-verify Color Intensity
      vec3 hotCore = vec3(1.0, 0.95, 0.8);
      vec3 deepRed = vec3(0.4, 0.0, 0.0);
      
      float warp = fbm(vUv * 3.0 + uTime * 0.1); 
      float structure = fbm(vUv + warp);
      
      // Ignition curve
      float heat = smoothstep(0.0, 0.5, uProgress) * (1.0 - smoothstep(0.5, 1.0, uProgress));
      
      vec3 col = mix(deepRed, hotCore, heat * structure);
      
      // Recession logic
      float fade = 1.0 - smoothstep(0.7, 1.0, uProgress);
      
      // Final Alpha = Structure * Vignette * Fade
      float alpha = (structure * 0.5 + 0.5) * softEdge * fade;
  
      gl_FragColor = vec4(col, alpha);
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
