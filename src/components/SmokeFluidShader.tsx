import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Efficient GLSL Noise & FBM
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
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

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 3; i++) { // Low iterations for performance
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0; // Center coords
    uv.x *= uResolution.x / uResolution.y; // Aspect fix

    // Domain Warping for Fluid/Smoke feel
    float t = uTime * 0.15;
    
    vec2 q = vec2(
      fbm(uv + t),
      fbm(uv + vec2(5.2, 1.3) + t)
    );

    vec2 r = vec2(
      fbm(uv + 4.0 * q + t * 1.5),
      fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 1.5)
    );

    float f = fbm(uv + 4.0 * r);

    // Deep smoke density
    float density = f * f * f + 0.6 * f * f + 0.5 * f;
    
    // Vignette to fade edges
    float dist = length(vUv - 0.5);
    float vignette = smoothstep(0.8, 0.2, dist);

    // Mix color with black for depth
    vec3 col = mix(vec3(0.0), uColor, density * 1.5);
    
    // Output
    gl_FragColor = vec4(col, density * uOpacity * vignette);
  }
`

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function SmokeMesh({ color, opacity }: { color: string | null, opacity: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  
  // Use a persistent color object to lerp values smoothly
  const targetColor = useRef(new THREE.Color(0x000000))
  const currentColor = useRef(new THREE.Color(0x000000))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x000000) },
      uOpacity: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) }
    }),
    []
  )

  // Update resolution on resize
  useMemo(() => {
    uniforms.uResolution.value.set(size.width, size.height)
  }, [size])

  useFrame((state) => {
    const { clock } = state
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()
      
      // Smoothly interpolate color
      if (color) {
        targetColor.current.set(color)
      }
      
      // Lerp current color towards target
      currentColor.current.lerp(targetColor.current, 0.05)
      material.uniforms.uColor.value.copy(currentColor.current)

      // Smoothly interpolate opacity
      const targetOpacity = color ? opacity : 0
      material.uniforms.uOpacity.value += (targetOpacity - material.uniforms.uOpacity.value) * 0.05
    }
  })

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Additive for glowy smoke
      />
    </mesh>
  )
}

export default function SmokeFluidShader({ color }: { color: string | null }) {
  return (
    <Canvas
      dpr={[1, 1.5]} // Optimization: Limit DPI
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <SmokeMesh color={color} opacity={0.8} />
    </Canvas>
  )
}
