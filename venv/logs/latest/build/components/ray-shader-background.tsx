"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

const RayShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create plane geometry for the shader
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create shader material with ray effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_scroll: { value: 0 },
        u_color1: { value: new THREE.Vector4(0.6235, 0, 1, 1) },
        u_color2: { value: new THREE.Vector4(0.3372, 0.3764, 1, 1) },
        u_intensity: { value: 0.946 },
        u_rays: { value: 0.094 },
        u_reach: { value: 0.211 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_scroll;
        uniform vec4 u_color1;
        uniform vec4 u_color2;
        uniform float u_intensity;
        uniform float u_rays;
        uniform float u_reach;

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
          
          // Set the ray source to top left
          vec2 rayPos1 = vec2(u_resolution.x * -0.2, u_resolution.y * -0.2);
          
          // Direction from top left to bottom right
          vec2 rayRefDir1 = normalize(vec2(1.0, 1.0));
          
          float raySeedA1 = 36.2214 * speed;
          float raySeedB1 = 21.11349 * speed;
          float raySpeed1 = 1.5 * speed;
          
          // Second ray source, slightly offset
          vec2 rayPos2 = vec2(u_resolution.x * -0.3, u_resolution.y * -0.1);
          vec2 rayRefDir2 = normalize(vec2(1.0, 0.8));
          float raySeedA2 = 22.39910 * speed;
          float raySeedB2 = 18.0234 * speed;
          float raySpeed2 = 1.1 * speed;
          
          // Calculate the colour of the sun rays on the current fragment
          vec4 rays1 = vec4(0.,0.,0., .0) +
            rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1) * u_color1;
           
          vec4 rays2 = vec4(0.,0.,0., .0) +
            rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2) * u_color2;
          
          vec4 fragColor = (rays1) + (rays2);
          
          // Attenuate brightness towards the bottom, simulating light-loss due to depth.
          float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
          fragColor *= (brightness + (0.5 + u_intensity));
          
          // Apply scroll fade effect
          fragColor *= max(0.0, 1.0 - (u_scroll * 1.5));
          
          gl_FragColor = fragColor;
        }
      `,
      transparent: true,
    })

    // Create mesh and add to scene
    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      material.uniforms.u_mouse.value.x = event.clientX / window.innerWidth
      material.uniforms.u_mouse.value.y = 1.0 - event.clientY / window.innerHeight
    }

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.u_resolution.value.x = window.innerWidth
      material.uniforms.u_resolution.value.y = window.innerHeight
    }

    // Handle scroll
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(1, scrollTop / (scrollHeight * 0.5)) // Fade out by 50% of page

      setScrollProgress(progress)
      material.uniforms.u_scroll.value = progress
    }

    // Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      material.uniforms.u_time.value = elapsedTime

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)

    // Initial calls
    handleResize()
    handleScroll()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }

      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
      style={{
        opacity: 1 - scrollProgress * 0.5, // Additional fade effect for container
      }}
    />
  )
}

export default RayShaderBackground
