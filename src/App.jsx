import { useState, useRef, useEffect } from "react";
import { useAnimation } from "framer-motion";
import useThrottle from "./hooks/useThrottle";
import ImageGrid from "./components/ImageGrid";
import "@fontsource/archivo-black";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/Loadingscreen";

const text = ["IMAGINING", "UNIQUE", "CONCEPTS", "AND DIGITAL", "EXPERIENCES"];

export default function App() {
  const [appState, setAppState] = useState({
    loading: true,
    cursorVisible: true,
    textLoading: true,
    hoveredImage: null,
    hoveredLine: null,
    isClient: false,
    fontSize: "6vw"
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const cursorAnimation = useAnimation();
  const imageRefs = useRef([]);
  const textContainerRef = useRef(null);

  // Throttled Mouse Move Handler
  const handleMouseMove = useThrottle((e) => {
    setAppState(prev => ({ ...prev, cursorVisible: true }));
    setMousePosition({ x: e.clientX, y: e.clientY });
    checkImageHover(e.clientX, e.clientY);
  }, 16); // ~60fps

  useEffect(() => {
    setAppState(prev => ({ ...prev, isClient: true }));

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", adjustFontSize);
    adjustFontSize();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [handleMouseMove]); // ✅ Added dependency

  useEffect(() => {
    if (appState.isClient) {
      cursorAnimation.start({
        x: mousePosition.x - 25,
        y: mousePosition.y - 25,
        transition: { type: "spring", stiffness: 500, damping: 50 },
      });
    }
  }, [mousePosition, cursorAnimation, appState.isClient]);

  useEffect(() => {
    if (!appState.loading) {
      console.log("Loading finished, showing homepage");
      setAppState(prev => ({ ...prev, textLoading: false }));
    }
  }, [appState.loading]);

  const checkImageHover = (x, y) => {
    let hoveredIndex = null;
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          hoveredIndex = index;
        }
      }
    });
    setAppState(prev => ({ ...prev, hoveredImage: hoveredIndex }));
  };

  const adjustFontSize = () => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const smallestDimension = Math.min(windowWidth, windowHeight);
    const newFontSize = Math.max(20, smallestDimension * (150 / 945));
    setAppState(prev => ({ ...prev, fontSize: `${newFontSize}px` }));
  };

  if (!appState.isClient) {
    return null;
  }

  return (
    <>
      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${appState.cursorVisible ? "visible" : "hidden"}`}
        style={{
          position: "fixed",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(100, 100, 255, 0.7)",
          pointerEvents: "none",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.1s ease",
          zIndex: 1000,
        }}
      />

      {appState.loading ? (
        <LoadingScreen onLoadingComplete={() => setAppState(prev => ({ ...prev, loading: false }))} />
      ) : (
        <>
          <Navbar />
          <div className="relative min-h-screen w-screen bg-[#212121] overflow-hidden flex flex-col justify-center items-center mt-10">
            <div className="absolute inset-0 flex justify-center items-center">
              <ImageGrid
                hoveredImage={appState.hoveredImage}
                setHoveredImage={(index) => setAppState(prev => ({ ...prev, hoveredImage: index })) }
                mousePosition={mousePosition}
                setMousePosition={setMousePosition}
              />
            </div>
            <div
              ref={textContainerRef}
              className="container flex flex-col justify-center items-center relative z-20 py-10"
            >
              {text.map((line, index) => (
                <h1
                  key={index}
                  className={`text relative inline-block cursor-pointer leading-[0.85] m-0 font-bold text-center ${
                    !appState.textLoading ? "text-emerged" : ""
                  }`}
                  style={{
                    fontFamily: "Archivo Black, sans-serif",
                    fontSize: appState.fontSize,
                    color: appState.hoveredImage !== null ? "#212121" : "#ffffff",
                    letterSpacing: ".01em",
                    transition: "color 0.005s ease",
                    overflow: "hidden",
                    textShadow:
                      appState.hoveredImage !== null
                        ? "-1px -1px 0 #424242, 1px -1px 0 #424242, -1px 1px 0 #424242, 1px 1px 0 #424242"
                        : "none",
                  }}
                  onMouseEnter={() => appState.hoveredImage === null && setAppState(prev => ({ ...prev, hoveredLine: index })) }
                  onMouseLeave={() => setAppState(prev => ({ ...prev, hoveredLine: null })) }
                >
                  <div className="split-parent">
                    <div className="split-child">
                      <span className="relative z-10 px-1 py-0.5">{line}</span>
                    </div>
                  </div>
                </h1>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
