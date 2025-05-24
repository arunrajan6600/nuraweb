"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Shader Material component
function ShaderMaterial() {
  const meshRef = useRef(null)
  const { size, viewport } = useThree()

  // Fragment shader code
  const fragmentShader = `
  // Uniforms
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec4 u_colors[2];
  uniform float u_intensity;
  uniform float u_rays;
  uniform float u_reach;

  #ifndef FNC_MOD289
  #define FNC_MOD289
  float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
  #endif

  #ifndef FNC_PERMUTE
  #define FNC_PERMUTE
  float permute(const in float x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec2 permute(const in vec2 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec3 permute(const in vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 permute(const in vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  #endif

  #ifndef FNC_TAYLORINVSQRT
  #define FNC_TAYLORINVSQRT
  float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  #endif

  #ifndef FNC_QUINTIC
  #define FNC_QUINTIC 
  float quintic(const in float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
  vec2  quintic(const in vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
  vec3  quintic(const in vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
  vec4  quintic(const in vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
  #endif

  #ifndef FNC_PNOISE
  #define FNC_PNOISE
  float pnoise(in vec2 P, in vec2 rep) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, rep.xyxy); 
      Pi = mod289(Pi);        
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;

      vec4 i = permute(permute(ix) + iy);

      vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
      vec4 gy = abs(gx) - 0.5 ;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;

      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);

      vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;

      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));

      vec2 fade_xy = quintic(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
  }
  #endif

  #if !defined(FNC_SATURATE) && !defined(saturate)
  #define FNC_SATURATE
  #define saturate(x) clamp(x, 0.0, 1.0)
  #endif

  float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    
    return clamp(
      (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
      (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
      u_reach, 1.0) *
      clamp((u_resolution.x - length(sourceToCoord)) / u_resolution.x, u_reach, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;
    
    // Set the parameters of the sun rays
    vec2 rayPos1 = vec2(u_resolution.x * 0.7, u_resolution.y * -0.4);
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214*speed;
    float raySeedB1 = 21.11349*speed;
    float raySpeed1 = 1.5*speed;
    
    vec2 rayPos2 = vec2(u_resolution.x * 0.8, u_resolution.y * -0.6);
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910*speed;
    float raySeedB2 = 18.0234*speed;
    float raySpeed2 = 1.1*speed;
    
    // Calculate the colour of the sun rays on the current fragment
    vec4 rays1 =
      vec4(0.,0.,0., .0) +
      rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1) * u_colors[0];
     
    vec4 rays2 =
      vec4(0.,0.,0., .0) +
      rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2) * u_colors[1];
    
    vec4 fragColor = (rays1) + (rays2);
    
    // Attenuate brightness towards the bottom, simulating light-loss due to depth.
    float brightness = 1.0*u_reach - (coord.y / u_resolution.y);
    fragColor *= (brightness + (0.5+ u_intensity));
    
    gl_FragColor = fragColor;
  }
  `

  // Vertex shader code
  const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `

  useFrame((state) => {
    const { clock, mouse, gl } = state

    if (meshRef.current) {
      // Update uniforms
      meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime()
      meshRef.current.material.uniforms.u_mouse.value = [mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5]

      const canvas = gl.domElement
      meshRef.current.material.uniforms.u_resolution.value = [canvas.width, canvas.height]
    }
  })

  // Create shader material with uniforms
  const shaderMaterial = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      u_time: { value: 0 },
      u_mouse: { value: [0.5, 0.5] },
      u_resolution: { value: [size.width, size.height] },
      u_colors: {
        value: [
          new THREE.Vector4(0.6235, 0, 1, 1), // Purple
          new THREE.Vector4(0.3372, 0.3764, 1, 1), // Blue
        ],
      },
      u_intensity: { value: 0.946 },
      u_rays: { value: 0.094 },
      u_reach: { value: 0.211 },
    },
    transparent: true,
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 bg-background/80">
      <Canvas className="!fixed inset-0" dpr={[1, 2]}>
        <ShaderMaterial />
      </Canvas>
    </div>
  )
}
