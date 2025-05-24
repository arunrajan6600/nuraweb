"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface MatrixGridBackgroundProps {
  className?: string
}

export default function MatrixGridBackground({ className = "" }: MatrixGridBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Listen for mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Canvas gl={{ antialias: true, powerPreference: "high-performance" }} dpr={[1, 1.5]} className="w-full h-full">
        <color attach="background" args={["#000000"]} />
        <MatrixShader mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}

function MatrixShader({ mousePosition }) {
  const { viewport, size, camera } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const time = useRef(0)
  const lastHoveredCell = useRef({ x: -1, y: -1 })
  const raycaster = useRef(new THREE.Raycaster())
  const mouse3D = useRef(new THREE.Vector2())
  const isMouseOverCanvas = useRef(true)
  const hoverEndTime = useRef(-1) // Time when hover ended
  const hoverDelay = 1.2 // Delay in seconds before glow fades out

  // Set up event listeners for mouse enter/leave
  useEffect(() => {
    const handleMouseLeave = () => {
      isMouseOverCanvas.current = false
      // Start the hover end timer when mouse leaves canvas
      hoverEndTime.current = time.current
    }

    const handleMouseEnter = () => {
      isMouseOverCanvas.current = true
      // Reset hover end time when mouse enters canvas
      hoverEndTime.current = -1
    }

    // Add event listeners to the canvas container
    const canvas = document.querySelector("canvas")
    if (canvas) {
      canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave)
      canvas.parentElement?.addEventListener("mouseenter", handleMouseEnter)
    }

    return () => {
      if (canvas) {
        canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave)
        canvas.parentElement?.removeEventListener("mouseenter", handleMouseEnter)
      }
    }
  }, [])

  // Update shader uniforms on each frame
  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return

    time.current += delta

    // Update uniforms
    materialRef.current.uniforms.u_time.value = time.current
    materialRef.current.uniforms.u_resolution.value.set(size.width, size.height)

    // Calculate time since hover ended (for fade-out effect)
    const timeSinceHoverEnded = hoverEndTime.current >= 0 ? time.current - hoverEndTime.current : -1
    materialRef.current.uniforms.u_hoverEndTime.value = timeSinceHoverEnded
    materialRef.current.uniforms.u_hoverDelay.value = hoverDelay

    // Only update hover state if mouse is over canvas
    if (isMouseOverCanvas.current) {
      // Reset hover end time when mouse is moving over canvas
      hoverEndTime.current = -1

      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse3D.current.x = (mousePosition.x / size.width) * 2 - 1
      mouse3D.current.y = -(mousePosition.y / size.height) * 2 + 1

      // Set up raycaster
      raycaster.current.setFromCamera(mouse3D.current, camera)

      // Perform raycasting
      const intersects = raycaster.current.intersectObject(meshRef.current)

      if (intersects.length > 0) {
        // Get intersection point in UV coordinates
        const uv = intersects[0].uv

        // Get grid size from uniforms
        const gridSize = materialRef.current.uniforms.u_gridSize.value

        // Calculate aspect ratio to maintain square cells
        const aspectRatio = size.width / size.height
        const adjustedGridSize = new THREE.Vector2(gridSize.x, gridSize.y)

        if (aspectRatio > 1.0) {
          // Landscape orientation
          adjustedGridSize.x = Math.floor(gridSize.y * aspectRatio)
        } else {
          // Portrait orientation
          adjustedGridSize.y = Math.floor(gridSize.x / aspectRatio)
        }

        // Calculate which cell is being hovered using the UV coordinates
        const cellX = Math.floor(uv.x * adjustedGridSize.x)
        const cellY = Math.floor(uv.y * adjustedGridSize.y)

        // Only update if the hovered cell has changed
        if (cellX !== lastHoveredCell.current.x || cellY !== lastHoveredCell.current.y) {
          materialRef.current.uniforms.u_hoveredCell.value.set(cellX, cellY)
          lastHoveredCell.current = { x: cellX, y: cellY }
        }
      }
    }
  })

  // Create shader material
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_gridSize;
      uniform vec2 u_hoveredCell;
      uniform float u_hoverEndTime;
      uniform float u_hoverDelay;
      
      varying vec2 vUv;
      
      // Function to draw a square with border
      float drawSquareBorder(vec2 st, vec2 size, float thickness) {
        // Calculate distance to the closest edge
        vec2 bottomLeft = step(vec2(thickness), st);
        vec2 topRight = step(vec2(thickness), size - st);
        
        // Combine edges
        float outline = 1.0 - (bottomLeft.x * bottomLeft.y * topRight.x * topRight.y);
        
        // Create the inner square (hollow center)
        vec2 innerBottomLeft = step(vec2(thickness * 2.0), st);
        vec2 innerTopRight = step(vec2(thickness * 2.0), size - st);
        float innerSquare = innerBottomLeft.x * innerBottomLeft.y * innerTopRight.x * innerTopRight.y;
        
        // Combine to get wireframe
        return outline - innerSquare;
      }
      
      // Function to draw a filled square
      float drawSquareFilled(vec2 st, vec2 size, float padding) {
        // Calculate distance to the closest edge with padding
        vec2 bottomLeft = step(vec2(padding), st);
        vec2 topRight = step(vec2(padding), size - st);
        
        // Combine edges to get filled square
        return bottomLeft.x * bottomLeft.y * topRight.x * topRight.y;
      }
      
      // Function to calculate distance between two cells
      float cellDistance(vec2 cell1, vec2 cell2) {
        return length(cell1 - cell2);
      }
      
      // Function to create a bloom effect
      vec3 applyBloom(vec3 color, float intensity) {
        return color * intensity;
      }
      
      void main() {
        // Calculate aspect ratio to maintain square cells
        float aspectRatio = u_resolution.x / u_resolution.y;
        
        // Determine the number of cells that fit in each dimension
        // We'll keep the y-dimension fixed and adjust x based on aspect ratio
        vec2 adjustedGridSize = u_gridSize;
        
        // Adjust grid size to maintain square cells
        if (aspectRatio > 1.0) {
          // Landscape orientation
          adjustedGridSize.x = floor(u_gridSize.y * aspectRatio);
        } else {
          // Portrait orientation
          adjustedGridSize.y = floor(u_gridSize.x / aspectRatio);
        }
        
        // Scale UV coordinates to grid size
        vec2 st = vUv * adjustedGridSize;
        
        // Get the integer and fractional parts of the coordinates
        vec2 cellIndex = floor(st);
        vec2 cellUv = fract(st);
        
        // Draw wireframe square border (thinner now)
        float thickness = 0.01; // Reduced thickness
        float padding = 0.02;   // Padding for the filled square
        float squareBorder = drawSquareBorder(cellUv, vec2(1.0), thickness);
        float squareFilled = drawSquareFilled(cellUv, vec2(1.0), padding);
        
        // Base color for all squares (dim white border)
        vec3 color = vec3(0.15) * squareBorder;
        
        // Calculate which cell is being hovered
        vec2 currentCell = cellIndex;
        
        // Calculate distance to hovered cell
        float dist = cellDistance(currentCell, u_hoveredCell);
        
        // Check if any cell is being hovered (u_hoveredCell is initialized to -1,-1)
        bool isAnyHovered = u_hoveredCell.x >= 0.0 && u_hoveredCell.y >= 0.0;
        
        // Calculate fade factor based on hover end time
        float fadeFactor = 1.0;
        if (u_hoverEndTime > 0.0) {
          // Gradually fade out after hover delay
          fadeFactor = 1.0 - smoothstep(0.0, u_hoverDelay, u_hoverEndTime);
        }
        
        // RGB glow effect for hovered and nearby cells
        if (isAnyHovered && dist < 4.0) {
          // Calculate glow intensity based on distance
          float glowIntensity = 1.0 - (dist / 4.0);
          glowIntensity = pow(glowIntensity, 1.5); // Adjusted falloff for more spread
          
          // Apply fade factor to glow intensity
          glowIntensity *= fadeFactor;
          
          // Pulsating effect
          glowIntensity *= 0.8 + 0.2 * sin(u_time * 3.0);
          
          // RGB color shift based on time and position
          float r = 0.5 + 0.5 * sin(u_time + currentCell.x * 0.5);
          float g = 0.5 + 0.5 * sin(u_time * 1.2 + currentCell.y * 0.5);
          float b = 0.5 + 0.5 * sin(u_time * 0.8 + (currentCell.x + currentCell.y) * 0.5);
          
          vec3 glowColor = vec3(r, g, b);
          
          // For the hovered cell, fill the entire box with glow
          if (dist < 0.1) {
            // Fill the box with bright color
            color = glowColor * squareFilled * 1.2 * fadeFactor;
            // Add border on top
            color += glowColor * squareBorder * 0.8 * fadeFactor;
            
            // Add intense bloom effect for hovered cell
            vec3 bloom = applyBloom(glowColor, 2.0 * fadeFactor) * squareFilled;
            color += bloom;
          } 
          // For nearby cells, add glow based on distance
          else {
            // Add glow to the fill based on distance
            color += glowColor * squareFilled * glowIntensity * 0.8;
            // Add glow to the border
            color += glowColor * squareBorder * glowIntensity * 0.6;
            
            // Add bloom effect that extends beyond the cell boundaries
            float bloomRadius = 0.5 * glowIntensity;
            vec3 bloom = applyBloom(glowColor, bloomRadius);
            color += bloom * 0.4 * squareFilled;
          }
          
          // Add outer glow that extends beyond cell boundaries
          float outerGlow = glowIntensity * 0.3;
          color += glowColor * outerGlow;
        }
        
        // Add subtle ambient glow to all cells
        float ambientPulse = 0.05 + 0.05 * sin(u_time + cellIndex.x * 0.2 + cellIndex.y * 0.3);
        color += vec3(0.1, 0.1, 0.2) * squareBorder * ambientPulse;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_gridSize: { value: new THREE.Vector2(12, 12) }, // Equal number for square grid
      u_hoveredCell: { value: new THREE.Vector2(-1, -1) }, // Currently hovered cell
      u_hoverEndTime: { value: -1 }, // Time since hover ended (-1 means still hovering)
      u_hoverDelay: { value: 1.2 }, // Delay in seconds before glow fades out
    },
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}
