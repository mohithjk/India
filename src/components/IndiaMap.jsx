import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import "react-tooltip/dist/react-tooltip.css";

const geoUrl = "/india_state.geojson";

const AshokaChakra = () => {
  const chakraRef = useRef(null);

  useEffect(() => {
    // Elegant, slow rotational spin
    gsap.to(chakraRef.current, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none"
    });
  }, []);

  return (
    <svg viewBox="0 0 100 100" ref={chakraRef} className="w-full h-full text-[#000080]" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="45" strokeWidth="4" />
      <circle cx="50" cy="50" r="8" strokeWidth="2" fill="currentColor" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line 
          key={i} 
          x1="50" y1="50" 
          x2="50" y2="5" 
          strokeWidth="3" 
          transform={`rotate(${i * 15} 50 50)`} 
        />
      ))}
    </svg>
  );
};

const IndiaMap = ({ onSelectState }) => {
  const [content, setContent] = useState("");

  return (
    <div className="map-container relative w-full h-[75vh] flex justify-center items-center overflow-visible select-none">
      
      {/* Permanent Ashoka Chakra - moved slightly left [47%] to visually center on the main map body */}
      <div className="absolute top-1/2 left-[47%] -translate-x-1/2 -translate-y-[55%] w-16 h-16 md:w-20 md:h-20 pointer-events-none z-[100] opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
        <AshokaChakra />
      </div>

      <Tooltip id="my-tooltip" className="z-50 !bg-gray-900/80 !backdrop-blur-md !text-white !p-3 !rounded-xl border border-white/10 shadow-2xl" />
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 980, // Slightly increased scale as requested
          center: [80, 22] 
        }}
        className="w-full h-full drop-shadow-2xl relative z-10"
      >
        <defs>
          <linearGradient id="flagTricolor" x1="0" y1="50" x2="0" y2="550" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="35%" stopColor="#FF9933" />
            <stop offset="35%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#138808" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        </defs>

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.NAME_1 || geo.properties.name || "Unknown State";
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setContent(stateName)}
                  onMouseLeave={() => setContent("")}
                  onClick={(e) => onSelectState && onSelectState(stateName, e.currentTarget)}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={stateName}
                  style={{
                    default: {
                      fill: "url(#flagTricolor)",
                      stroke: "rgba(255, 255, 255, 0.3)",
                      strokeWidth: 0.5,
                      outline: "none",
                      transition: "all 0.3s ease"
                    },
                    hover: {
                      fill: "url(#flagTricolor)",
                      stroke: "rgba(255, 255, 255, 0.8)",
                      strokeWidth: 1.2,
                      outline: "none",
                      cursor: "pointer",
                      transform: "translateY(-2px)",
                      filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255,255,255,0.4))"
                    },
                    pressed: {
                      fill: "url(#flagTricolor)",
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Floating Info panel when hovering an active state */}
      {content && (
        <div className="absolute bottom-4 left-10 pointer-events-none fade-in z-20">
          <div className="glass-panel p-6 rounded-2xl max-w-sm">
            <h2 className="text-3xl font-bold text-white mb-2">{content}</h2>
            <p className="text-blue-200/80 text-sm italic tracking-widest uppercase">Interactive Map</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
