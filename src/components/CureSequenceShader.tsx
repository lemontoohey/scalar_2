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
  
  // -- NOISE FUNCTIONS --
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
  
  // Recursive Noise (Domain Warping)
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500 * smoothNoise(p); p *= 2.01;
    f += 0.250 * smoothNoise(p); p *= 2.03;
    f += 0.125 * smoothNoise(p);
    return f;
  }
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    // 1. Calculate fundamental distance
    float dist = length(vUv - center);
    
    // 2. THE IMPERFECTION (Organic Wobbly Edge)
    // We disturb the UV lookup for the edge calculation slightly
    float distortion = fbm(vUv * 3.0 - uTime * 0.1); 
    float organicDist = dist - (distortion * 0.05); // +/- 5% imperfection

    // 3. THE MISTY CONTAINER (Hugs text at ~0.35 radius)
    // 0.28 = clear core, 0.45 = fade out. Anything outside 0.45 is strictly transparent.
    float containerMask = 1.0 - smoothstep(0.28, 0.45, organicDist); 

    // 4. THE FLUID INTERNAL WARP (The visual texture)
    vec2 q = vec2(fbm(vUv + uTime * 0.05));
    float flow = fbm(vUv * 3.0 + q + uTime * 0.1);
    
    // 5. COLOR MAPPING (Deep Red -> Oxygenated Red -> White Heat)
    vec3 deepRed = vec3(0.2, 0.0, 0.05);
    vec3 brightRed = vec3(0.8, 0.05, 0.05);
    vec3 boneWhite = vec3(1.0, 0.96, 0.9);
    
    // Animate visual density with progress
    float ignition = smoothstep(0.0, 0.4, uProgress) * (1.0 - smoothstep(0.6, 1.0, uProgress));
    
    vec3 fluidColor = mix(deepRed, brightRed, flow);
    // Flash white ONLY in the hottest flow channels during ignition
    fluidColor = mix(fluidColor, boneWhite, smoothstep(0.6, 1.0, flow) * ignition);

    // 6. FINAL ALPHA COMPOSITE
    // Must be invisible at the start/end (recession) and constrained by the container
    float recession = 1.0 - smoothstep(0.85, 1.0, uProgress);
    
    // Combine: The container shape * The Flow Texture * The Fade timer
    float alpha = containerMask * (flow * 0.5 + 0.5) * recession;

    gl_FragColor = vec4(fluidColor, alpha);
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
