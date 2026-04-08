import React, { useState, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";
import stateDistricts from "../data/stateDistricts";

const geoUrl = "/india_state.geojson";

// State name normalization map: GeoJSON NAME_1 → our data key
const STATE_NAME_MAP = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
};

function normalizeStateName(name) {
  return STATE_NAME_MAP[name] || name;
}

// Per-region glow colors for district markers
const DISTRICT_COLOR = "#FF9933";

const AshokaChakra = React.memo(() => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full text-[#000080]"
      fill="none"
      stroke="currentColor"
      style={{
        animation: "spin 30s linear infinite",
        transformOrigin: "center",
      }}
    >
      <circle cx="50" cy="50" r="45" strokeWidth="4" />
      <circle cx="50" cy="50" r="8" strokeWidth="2" fill="currentColor" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="5"
          strokeWidth="3"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
});

const IndiaMap = ({ onSelectState }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [zoomedState, setZoomedState] = useState(null); // { name, center, zoom, districts }
  const [tooltipContent, setTooltipContent] = useState("");
  const [isZooming, setIsZooming] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const mapPosition = zoomedState
    ? { zoom: zoomedState.zoom, center: zoomedState.center }
    : { zoom: 1, center: [80, 22] };

  const handleStateClick = useCallback(
    (stateName) => {
      const normalized = normalizeStateName(stateName);
      const data = stateDistricts[normalized];
      if (data) {
        setIsZooming(true);
        setTimeout(() => {
          setZoomedState({ name: normalized, ...data });
          setIsZooming(false);
        }, 100);
      } else {
        // No district data — go straight to story
        onSelectState && onSelectState(stateName, null);
      }
    },
    [onSelectState]
  );

  const handleBackToIndia = useCallback(() => {
    setZoomedState(null);
    setHoveredState(null);
    setHoveredDistrict(null);
  }, []);

  const handleDistrictClick = useCallback(
    (districtName) => {
      onSelectState && onSelectState(districtName, null);
    },
    [onSelectState]
  );

  const isZoomed = !!zoomedState;
  const districtGeoUrl = zoomedState ? `/districts/${zoomedState.name.replace(/\s+/g, '_')}.geojson` : null;

  return (
    <div className="map-container relative w-full h-[75vh] flex justify-center items-center overflow-visible select-none">
      {/* Ashoka Chakra — hide when zoomed in */}
      <AnimatePresence>
        {!isZoomed && (
          <motion.div
            key="chakra"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/2 left-[47%] -translate-x-1/2 -translate-y-[55%] w-16 h-16 md:w-20 md:h-20 pointer-events-none z-[100] opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            <AshokaChakra />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button when zoomed */}
      <AnimatePresence>
        {isZoomed && (
          <motion.button
            key="back-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={handleBackToIndia}
            className="absolute top-4 left-4 z-[200] flex items-center space-x-2 text-white/70 hover:text-white transition-all glass-panel px-5 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold"
          >
            <ArrowLeft size={14} />
            <span>Back to India</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* State label when zoomed */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            key="state-label"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] text-center pointer-events-none"
          >
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white shimmer-glow uppercase">
              {zoomedState?.name}
            </h2>
            <p className="text-orange-400/70 text-[10px] tracking-[0.4em] uppercase mt-1">
              Select a district · Click to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hovered district tooltip */}
      <AnimatePresence>
        {hoveredDistrict && (
          <motion.div
            key="district-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] glass-panel px-6 py-3 rounded-2xl text-center pointer-events-none"
          >
            <p className="text-white font-bold text-lg">{hoveredDistrict.name}</p>
            {hoveredDistrict.altName && (
              <p className="text-gray-400 text-xs mt-0.5">({hoveredDistrict.altName})</p>
            )}
            <p className="text-orange-400/70 text-[10px] tracking-widest uppercase mt-1">
              Click to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip for states (only when not zoomed) */}
      {!isZoomed && (
        <Tooltip
          id="state-tooltip"
          className="z-50 !bg-gray-900/80 !backdrop-blur-md !text-white !p-3 !rounded-xl border border-white/10 shadow-2xl"
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 980, center: [80, 22] }}
        className="w-full h-full drop-shadow-2xl relative z-10"
      >
        <defs>
          <linearGradient
            id="flagTricolor"
            x1="0" y1="50" x2="0" y2="550"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="35%" stopColor="#FF9933" />
            <stop offset="35%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#138808" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
          <linearGradient
            id="zoomedState"
            x1="0" y1="0" x2="0" y2="1"
          >
            <stop offset="0%" stopColor="rgba(255,153,51,0.6)" />
            <stop offset="100%" stopColor="rgba(19,136,8,0.5)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ZoomableGroup
          zoom={mapPosition.zoom}
          center={mapPosition.center}
          filterZoomEvent={() => false} /* disable mouse-wheel zoom — we control it */
          onMoveEnd={() => {}}
          style={{ transition: isZooming ? "none" : "all 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        >
          {/* Base States Layer */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rawName = geo.properties.NAME_1 || geo.properties.name || "Unknown";
                const normalized = normalizeStateName(rawName);
                const isZoomedThis = zoomedState?.name === normalized;
                const hasDistricts = !!stateDistricts[normalized];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredState(rawName);
                      setTooltipContent(rawName);
                    }}
                    onMouseLeave={() => {
                      setHoveredState(null);
                      setTooltipContent("");
                    }}
                    onClick={() => handleStateClick(rawName)}
                    data-tooltip-id={!isZoomed ? "state-tooltip" : undefined}
                    data-tooltip-content={!isZoomed ? rawName : undefined}
                    style={{
                      default: {
                        fill: isZoomedThis ? "url(#zoomedState)" : "url(#flagTricolor)",
                        stroke: isZoomedThis
                          ? "rgba(255,153,51,0.9)"
                          : "rgba(255, 255, 255, 0.3)",
                        strokeWidth: isZoomedThis ? 1.5 : 0.5,
                        outline: "none",
                        transition: "all 0.4s ease",
                        filter: isZoomedThis ? "url(#glow)" : "none",
                      },
                      hover: {
                        fill: hasDistricts
                          ? "rgba(255,153,51,0.7)"
                          : "url(#flagTricolor)",
                        stroke: "rgba(255, 255, 255, 0.9)",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        filter: "brightness(1.2) drop-shadow(0 0 12px rgba(255,153,51,0.5))",
                        transition: "all 0.3s ease",
                      },
                      pressed: {
                        fill: "rgba(255,153,51,0.85)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* District Boundaries Layer */}
          {isZoomed && districtGeoUrl && (
            <Geographies geography={districtGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const districtName = geo.properties.NAME_2 || geo.properties.name || "Unknown";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredDistrict({ name: districtName })}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => handleDistrictClick(districtName)}
                      style={{
                        default: {
                          fill: "rgba(255, 255, 255, 0.15)",
                          stroke: "rgba(255, 255, 255, 0.8)",
                          strokeWidth: 0.2,
                          outline: "none",
                          transition: "all 0.3s ease",
                        },
                        hover: {
                          fill: "rgba(255, 153, 51, 0.6)",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                          cursor: "pointer",
                          filter: "drop-shadow(0 0 8px rgba(255, 153, 51, 0.6))",
                          transition: "all 0.2s ease",
                        },
                        pressed: {
                          fill: "rgba(255, 153, 51, 0.8)",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Floating hover panel for states (not zoomed) */}
      <AnimatePresence>
        {!isZoomed && tooltipContent && (
          <motion.div
            key={tooltipContent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-10 pointer-events-none z-20"
          >
            <div className="glass-panel p-5 rounded-2xl max-w-sm">
              <h2 className="text-2xl font-bold text-white mb-1">{tooltipContent}</h2>
              <p className="text-blue-200/80 text-xs italic tracking-widest uppercase">
                {stateDistricts[normalizeStateName(tooltipContent)]
                  ? `${stateDistricts[normalizeStateName(tooltipContent)].districts.length} districts · Click to explore`
                  : "Click to explore"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndiaMap;
