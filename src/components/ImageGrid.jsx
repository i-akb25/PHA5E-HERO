import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useThrottle from "../hooks/useThrottle";
import "@fontsource/archivo-black";

const imageData = [
  { src: "/biggerscience.png", title: "BIGGER SCIENCE", description: "Immersive experience/WebGL/Gaming" },
  { src: "/muceum.png", title: "MUCEM", description: "Experiential Website" },
  { src: "/unganisha.png", title: "UNGANISHA", description: "Experiential Website/WebGL/3D" },
  { src: "/olive tree.jpg", title: "OLIVE TREE", description: "Interactive installation/Realtime" }
];

const ImageGrid = ({ hoveredImage, setHoveredImage, setMousePosition }) => {
  const containerRefs = useRef({});
  const [targetPositions, setTargetPositions] = useState(imageData.map(() => ({ x: 0, y: 0 })));

  // Throttled Mouse Move Event
  const throttledMouseMove = useThrottle((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    checkImageHover(e.clientX, e.clientY);
  }, 100);

  useEffect(() => {
    window.addEventListener("mousemove", throttledMouseMove);
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [throttledMouseMove]);

  useEffect(() => {
    containerRefs.current && Object.values(containerRefs.current).forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          x: targetPositions[index].x,
          y: targetPositions[index].y,
          duration: 2,
          ease: "power2.out",
        });
      }
    });
  }, [targetPositions]);

  const checkImageHover = (x, y) => {
    let newHoveredIndex = null;

    Object.entries(containerRefs.current).some(([index, ref]) => {
      if (!ref) return false;
      const rect = ref.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        newHoveredIndex = Number(index);
        return true;
      }
      return false;
    });

    setHoveredImage(newHoveredIndex);
    updateTargetPositions(newHoveredIndex, x, y);
  };

  const updateTargetPositions = (hoveredIndex, cursorX, cursorY) => {
    setTargetPositions((prev) =>
      prev.map((pos, index) => {
        if (index === hoveredIndex) {
          const containerRef = containerRefs.current[index];
          if (!containerRef) return pos;

          const rect = containerRef.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;

          const dx = Math.min((cursorX - centerX) * 0.5, 100);
          const dy = Math.min((cursorY - centerY) * 0.5, 100);

          return { x: dx, y: dy };
        }
        return pos;
      })
    );
  };

  const ImageComponent = ({ image, index }) => (
    <div
      className="relative overflow-hidden"
      style={{ width: "340px", height: "200px" }}
      onMouseEnter={() => setHoveredImage(index)}
      onMouseLeave={() => setHoveredImage(null)}
    >
      {hoveredImage === null || hoveredImage === index ? (
        <img
          src={image.src}
          alt={`Image ${index + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative" style={{ width: "340px", height: "248px" }}>
            {hoveredImage !== null && (
              <>
                {(() => {
                  const width = 340;
                  const height = 200;
                  const angle = Math.atan(height / width) * (180 / Math.PI);
                  return (
                    <>
                      <div
                        className="absolute"
                        style={{
                          width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                          height: "1px",
                          backgroundColor: "#616161",
                          top: "0",
                          left: "0",
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: "top left",
                          zIndex: "40",
                        }}
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 border border-[#616161]" />
                      <div
                        className="absolute"
                        style={{
                          width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                          height: "1px",
                          backgroundColor: "#616161",
                          top: "0",
                          right: "0",
                          transform: `rotate(-${angle}deg)`,
                          transformOrigin: "top right",
                          zIndex: "40",
                        }}
                      />
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const TextComponent = ({ image, index }) => (
    <div
      className="absolute text-white"
      style={{
        zIndex: 40,
        width: "340px",
        bottom: "-45px",
        left: "100%",
        opacity: hoveredImage === index ? 1 : 0,
        transition: "opacity 0.3s ease",
        transform: "translateX(-50%)",
        textAlign: "left",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", fontFamily: "Archivo Black, sans-serif" }}>
        {image.title}
      </h1>
      <p className="text-sm">{image.description}</p>
    </div>
  );

  return (
    <div>
      <style>
        {`
          .circular-layout {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 600px;
            height: 600px;
          }

          .circular-item {
            position: absolute;
            width: 340px;
            height: 210px;
            transform: translate(-50%, -50%);
          }

          .circular-item:nth-child(1) { top: 35%; left: -10%; }
          .circular-item:nth-child(2) { top: 20%; left: 106%; }
          .circular-item:nth-child(3) { top: 90%; left: 10%; }
          .circular-item:nth-child(4) { top: 80%; left: 110%; }  
        `}
      </style>

      <div className="circular-layout">
        {imageData.map((image, index) => (
          <div
            key={index}
            ref={(el) => (containerRefs.current[index] = el)}
            className="circular-item"
            style={{ zIndex: hoveredImage === null ? "10" : "30" }}
          >
            <a
              href="#"
              onMouseEnter={() => setHoveredImage(index)}
            >
              <ImageComponent image={image} index={index} />
            </a>
            <TextComponent image={image} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
