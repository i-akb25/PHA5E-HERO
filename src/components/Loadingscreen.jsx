"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { motion, useAnimation } from "framer-motion";
import "@fontsource/archivo-black";

// Animation Configuration
const ANIMATION_CONFIG = {
  fontSize: 48,
  strokeWidth: 1,
  strokeColor: "#ffffff",
  fillColor: "#ffffff",
  outlineDuration: 1.5,
  fillDuration: 1.6,
  zoomDuration: 0.6,
  zoomScale: [1, 1.5, 8],
  opacityRange: [1, 0.5, 0],
  text: "PHA5E"
};

const LoadingScreen = ({ onLoadingComplete }) => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;
    console.log("LoadingScreen mounted");

    const startAnimation = async () => {
      console.log("Starting animation");
      await controls.start({
        scale: ANIMATION_CONFIG.zoomScale,
        opacity: ANIMATION_CONFIG.opacityRange,
        transition: {
          duration: ANIMATION_CONFIG.zoomDuration,
          ease: "easeInOut",
        },
      });

      if (isMounted) {
        console.log("Loading animation complete");
        console.log("Calling onLoadingComplete");
        onLoadingComplete();
      }
    };

    const timeout = setTimeout(startAnimation, (ANIMATION_CONFIG.outlineDuration + ANIMATION_CONFIG.fillDuration) * 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [controls, onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
      role="alert"
      aria-live="assertive"
      aria-label="Loading screen"
    >
      <svg
        width="clamp(250px, 50vw, 600px)"
        height="auto"
        viewBox={`0 0 ${ANIMATION_CONFIG.text.length * ANIMATION_CONFIG.fontSize * 0.8} ${ANIMATION_CONFIG.fontSize * 1.2}`}
      >
        {/* Mask for Bottom-to-Top Fill Animation */}
        <defs>
          <mask id="reveal-mask">
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="white"
              initial={{ y: ANIMATION_CONFIG.fontSize * 1.2 }}
              animate={{ y: 0 }}
              transition={{
                duration: ANIMATION_CONFIG.fillDuration,
                ease: "easeInOut",
                delay: ANIMATION_CONFIG.outlineDuration - 0.2,
              }}
            />
          </mask>
        </defs>

        {/* Filled Text with Mask */}
        <text
          x="0"
          y={ANIMATION_CONFIG.fontSize}
          fontSize={ANIMATION_CONFIG.fontSize}
          fontFamily="Archivo Black, sans-serif"
          fill={ANIMATION_CONFIG.fillColor}
          mask="url(#reveal-mask)"
        >
          {ANIMATION_CONFIG.text}
        </text>

        {/* Outline Stroke Animation */}
        <motion.text
          x="0"
          y={ANIMATION_CONFIG.fontSize}
          fontSize={ANIMATION_CONFIG.fontSize}
          fontFamily="Archivo Black, sans-serif"
          fill="transparent"
          stroke={ANIMATION_CONFIG.strokeColor}
          strokeWidth={ANIMATION_CONFIG.strokeWidth}
          initial={{ strokeDasharray: "0 100%" }}
          animate={{ strokeDasharray: "100% 0" }}
          transition={{
            duration: ANIMATION_CONFIG.outlineDuration,
            ease: "easeInOut",
          }}
        >
          {ANIMATION_CONFIG.text}
        </motion.text>
      </svg>
    </div>
  );
};

LoadingScreen.propTypes = {
  onLoadingComplete: PropTypes.func.isRequired,
};

export default LoadingScreen;
