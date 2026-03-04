import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  varying vec2 vUv;

  // Simplex 2D noise (Standard)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // FBM
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 3; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    
    // Domain Warping for localized smoke ball
    float t = uTime * 0.2;
    vec2 q = vec2(fbm(uv + t), fbm(uv + t + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(uv + 4.0*q + t), fbm(uv + 4.0*q + t));
    float f = fbm(uv + 4.0*r);

    // Circular fade for "Ball" shape
    float dist = length(uv);
    float alpha = smoothstep(0.6, 0.2, dist);
    
    // Density
    float density = f * alpha;

    vec3 col = mix(vec3(0.0), uColor, density * 1.5 + 0.2);
    
    gl_FragColor = vec4(col, density * uOpacity);
  }
`

export default function MistShape({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.getElapsedTime()
      material.uniforms.uColor.value.set(color)
      material.uniforms.uOpacity.value = 1.0 // Fade in handled by parent opacity? Or uniform?
      // Actually we'll keep opacity 1 here and fade the group
    }
  })

  const uniforms = useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: 1.0 }
  })

  return (
    <mesh ref={meshRef} scale={[3, 3, 3]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
