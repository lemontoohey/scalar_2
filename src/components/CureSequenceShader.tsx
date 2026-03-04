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
    float f = smoothNoise(p);
    f += 0.5 * smoothNoise(p * 2.0);
    f += 0.25 * smoothNoise(p * 4.0);
    return f / 1.75;
  }
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    
    // TIGHTENED SPREAD: Reduced to tightly hug text
    float singularity = 1.0 - smoothstep(0.05, 0.28, dist);
    
    // SUGGESTION 1: DEPTH - Dual layers moving opposite directions for volume
    float tex1 = fbm(vUv * 1.5 + uTime * uSpeed);
    float tex2 = fbm(vUv * 3.0 - uTime * (uSpeed * 0.5)); // Reverse flow
    float tex = mix(tex1, tex2, 0.5); 
    
    float mass = singularity * (0.8 + 0.2 * tex);
    
    // Dark Red Rest State vs Hot White Peak
    const vec3 uColorRest = vec3(0.27, 0.0, 0.0);
    const vec3 uColorPeak = vec3(1.0, 0.988, 0.91);
    
    // Ignition curve
    float ignitionHeat = smoothstep(0.0, 0.5, uProgress) * (1.0 - smoothstep(0.5, 1.0, uProgress));
    
    // SUGGESTION 2: RESONANCE - Subtle Chromatic Shift on Peak
    // Shift color mixing slightly for R vs GB channels during high heat
    vec3 hotCoreColor;
    hotCoreColor.r = mix(uColorRest.r, uColorPeak.r, ignitionHeat);
    hotCoreColor.gb = mix(uColorRest.gb, uColorPeak.gb, ignitionHeat * 0.95); // Slight lag
    
    vec3 finalColor = mix(uColorRest, hotCoreColor, mass);
    
    // Fade out logic
    float recession = 1.0 - smoothstep(0.5, 1.0, uProgress);
    
    // SUGGESTION 3: TEXTURE DISSOLVE
    // As it fades, eat away at the alpha using noise for a smoke-like disappearance
    float dissolve = smoothstep(0.0, 0.4, recession + tex * 0.3); 
    
    // Fade out completely by the very end
    float finalFade = 1.0 - smoothstep(0.9, 1.0, uProgress);
    
    float alpha = mass * (0.4 + 0.6 * recession) * dissolve * finalFade;
    
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
  // React state removed for performance (pure uniform drive)
  const startTimeRef = useRef<number | null>(null)
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

  useFrame((state) => {
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime
    const elapsedMs = (state.clock.elapsedTime - startTimeRef.current) * 1000
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
        material.uniforms.uTime.value = state.clock.elapsedTime
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
