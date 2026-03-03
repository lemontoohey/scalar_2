'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.2113248, 0.366025, -0.57735, 0.02439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    return 130.0 * dot(m*m, vec3( dot(x0,p.x), dot(x12.xy,p.y), dot(x12.zw,p.z) ));
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Timeline Math (Peak Heat specifically maps to exactly 1.6s real-world time)
    float heat = smoothstep(1.0, 1.6, uTime) * (1.0 - smoothstep(1.6, 2.5, uTime));

    float currentRadius = mix(0.1, 0.28, smoothstep(0.0, 1.5, uTime)) + (heat * 0.3);
    
    float rawNoise = snoise(vUv * 3.0 - (uTime * 0.15));
    float stableMist = rawNoise * 0.5 + 0.5; 

    float baseAlpha = 1.0 - smoothstep(currentRadius * 0.3, currentRadius, dist);
    
    vec3 colorMist = vec3(0.9, 0.02, 0.05); // Deep pure red
    vec3 colorBurn = vec3(1.0, 0.9, 0.7);   // Bulb flash
    
    vec3 finalOut = mix(colorMist * stableMist * 2.0, colorBurn, heat * baseAlpha * 2.0);
    
    float alphaOutput = (baseAlpha * stableMist) + (heat * baseAlpha);
    alphaOutput *= smoothstep(0.0, 0.4, uTime); // Quick Fade In
    
    // Protect rendering boundary edges
    if (dist > 0.49 || alphaOutput <= 0.01) { discard; } 

    gl_FragColor = vec4(finalOut, clamp(alphaOutput, 0.0, 1.0));
  }
`

function MistPlane() {
  const { viewport } = useThree()
  const timeVar = useRef(0)
  const shaderParams = useMemo(() => ({ uTime: { value: 0.0 } }), [])

  useFrame((_, delta) => {
    timeVar.current += Math.min(delta, 0.1) // Safely throttle lag spikes
    shaderParams.uTime.value = timeVar.current
  })

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[Math.max(viewport.width * 1.5, 10), Math.max(viewport.height * 1.5, 10)]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={shaderParams}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}

export default function CanvasWrapper() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <MistPlane />
    </Canvas>
  )
}
