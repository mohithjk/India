import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VirtualTour = ({ location, onBack }) => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  
  // Layer refs
  const layer1Ref = useRef(null); // Landscape
  const layer2Ref = useRef(null); // Food
  const layer3Ref = useRef(null); // Culture

  // Text refs
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useEffect(() => {
    // Reset scroll to top when mounting
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Smooth scrubbing
        }
      });

      // Initially, Layer 1 is visible and normal.
      // As we scroll from 0 to 33%, Layer 1 scales way up (zooms past camera) and fades out.
      // Layer 2 scales from small/blurry to normal.
      
      tl.to(layer1Ref.current, {
        scale: 4,
        opacity: 0,
        ease: "power2.inOut",
      }, 0);

      tl.to(text1Ref.current, {
        opacity: 0,
        y: -100,
        ease: "power2.inOut",
      }, 0);

      // Layer 2 arrives
      tl.fromTo(layer2Ref.current, 
        { scale: 0.5, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.inOut" },
        0
      );

      tl.fromTo(text2Ref.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, ease: "power2.out" },
        0.1
      );

      // 33% to 66%: Layer 2 zooms past and fades out. Layer 3 arrives.
      tl.to(layer2Ref.current, {
        scale: 4,
        opacity: 0,
        ease: "power2.inOut",
      }, 0.4);

      tl.to(text2Ref.current, {
        opacity: 0,
        y: -100,
        ease: "power2.in",
      }, 0.4);

      tl.fromTo(layer3Ref.current,
        { scale: 0.5, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.inOut" },
        0.4
      );

      tl.fromTo(text3Ref.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, ease: "power2.out" },
        0.5
      );

      // 66% to 100%: Let Layer 3 linger, maybe slightly scale up for natural breath
      tl.to(layer3Ref.current, {
        scale: 1.1,
        ease: "none"
      }, 0.8);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#020202]">
      <div 
        ref={stickyRef} 
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-[1000px] select-none"
      >
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-50 flex items-center space-x-2 text-white/70 hover:text-white transition-colors glass-panel px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>Exit Tour</span>
        </button>

        {/* Global Grain/Noise overlay for cinematic texture */}
        <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

        {/* Layer 3: Culture */}
        <div 
          ref={layer3Ref} 
          className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-10"
          style={{ backgroundImage: "url('/culture.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>

        {/* Layer 2: Food */}
        <div 
          ref={layer2Ref} 
          className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-20"
          style={{ backgroundImage: "url('/food.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>
        </div>

        {/* Layer 1: Landscape */}
        <div 
          ref={layer1Ref} 
          className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-30"
          style={{ backgroundImage: "url('/landscape.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
        </div>

        {/* Text Overlay Containers */}
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center mix-blend-screen overflow-hidden">
          
          {/* Text 1 */}
          <div ref={text1Ref} className="absolute flex flex-col items-center justify-center w-full px-4">
            <p className="text-indigo-300 font-medium tracking-[0.3em] uppercase text-sm mb-4">Entering</p>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter shadow-2xl drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]">{location}</h1>
            <p className="mt-8 text-xl text-gray-300 max-w-2xl font-light">Scroll slowly to descend into the breathtaking landscapes and profound depths of this beautiful state.</p>
            <div className="mt-12 animate-pulse w-[1px] h-24 bg-gradient-to-b from-white/80 to-transparent"></div>
          </div>

          {/* Text 2 */}
          <div ref={text2Ref} className="absolute flex flex-col items-center justify-center w-full px-4 opacity-0 mt-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-serif italic">Culinary Heritage</h2>
            <p className="mt-6 text-xl text-gray-200 max-w-2xl leading-relaxed">Savor the ancient recipes and rich spices, a feast illuminated by tradition.</p>
          </div>

          {/* Text 3 */}
          <div ref={text3Ref} className="absolute flex flex-col items-center justify-center w-full px-4 opacity-0 mt-20">
            <h2 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-white drop-shadow-[0_0_25px_rgba(100,100,255,0.4)]">Eternal Spirit</h2>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed font-light">Uncover the timeless architecture and echoing stories mapped deeply into its cultural roots.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default VirtualTour;
