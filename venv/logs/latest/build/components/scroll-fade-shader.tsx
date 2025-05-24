"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const ScrollFadeShader = () => {
  const shaderRef = useRef(null)

  useEffect(() => {
    if (!shaderRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    shaderRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_scroll;
        void main() {
          float alpha = smoothstep(0.0, 0.5, u_scroll);
          gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
        }
      `,
      transparent: true,
      uniforms: {
        u_scroll: { value: 0 },
      },
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    const handleScroll = () => {
      const scrollPosition = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      material.uniforms.u_scroll.value = scrollPosition
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (shaderRef.current) {
        shaderRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={shaderRef} className="fixed top-0 left-0 w-full h-screen pointer-events-none z-20" />
}

export default ScrollFadeShader
