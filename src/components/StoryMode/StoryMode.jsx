import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CharSplitter = ({ text, className, charClassName }) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          className={`inline-block ${charClassName}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'inline-block' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

const stateAssets = {
  'Karnataka': {
    landscape: '/karnataka_place.png',
    food: '/karnataka_food.png',
    culture: '/karnataka_culture.png'
  },
  'Maharashtra': {
    landscape: '/maharashtra_landscape.png',
    food: '/maharashtra_food.png',
    culture: '/maharashtra_culture.png'
  },
  'Gujarat': {
    landscape: '/gujarat_landscape.png',
    food: '/gujarat_food.png',
    culture: '/gujarat_culture.png'
  },
  'Rajasthan': {
    landscape: '/rajasthan_landscape.png',
    food: '/rajasthan_food.png',
    culture: '/rajasthan_culture.png'
  }
};

const StoryMode = ({ location, onBack }) => {
  const containerRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  // Get current state assets or defaults
  const assets = stateAssets[location] || {
    landscape: '/landscape.png',
    food: '/food.png',
    culture: '/culture.png'
  };

  // Layer refs for the 3D Zoom Effect
  const layer1Ref = useRef(null); // Landscape
  const layer2Ref = useRef(null); // Food
  const layer3Ref = useRef(null); // Culture

  // Text refs for staggered reveals
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  // Reset scroll to top IMMEDIATELY on mount to avoid ScrollTrigger gaps
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // PHASE 1: THE MOVIE TITLE REVEAL
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Delay slightly to ensure ScrollTrigger can refresh after the black overlay is gone
        gsap.delayedCall(0.1, () => setShowContent(true));
      }
    });

    tl.from(".char", {
      y: -80,
      opacity: 0,
      filter: "blur(50px)",
      stagger: 0.08,
      duration: 1.5,
      ease: "power4.out"
    });

    tl.to(".title-overlay", {
      opacity: 0,
      scale: 1.2,
      filter: "blur(30px)",
      duration: 1,
      delay: 0.5
    });

  }, { scope: containerRef });

  // PHASE 2 & 3: CLASSIC 3D ZOOM-THROUGH (Enhanced with GSAP)
  useGSAP(() => {
    if (!showContent) return;

    // Force refresh and ensure scroll is zero
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".story-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    // PARALLAX DEPTH: Dust/Particles drifting
    gsap.utils.toArray(".particle-layer").forEach((p, idx) => {
      gsap.to(p, {
        y: -100 * (idx + 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".story-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });
    });

    // 0% to 33.3%: Layer 1 Zooms Past, Layer 2 Arrives
    tl.to(layer1Ref.current, {
      scale: 5,
      opacity: 0,
      filter: "blur(20px)",
      ease: "power2.inOut",
    }, 0);

    tl.to(text1Ref.current, {
      opacity: 0,
      y: -150,
      filter: "blur(20px)",
      ease: "power2.inOut",
    }, 0);

    tl.fromTo(layer2Ref.current, 
      { scale: 0.4, opacity: 0, filter: "blur(40px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.inOut" },
      0
    );

    tl.fromTo(text2Ref.current,
      { opacity: 0, y: 150, filter: "blur(40px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" },
      0.15
    );

    // 33.3% to 66.6%: Layer 2 Zooms Past, Layer 3 Arrives
    tl.to(layer2Ref.current, {
      scale: 5,
      opacity: 0,
      filter: "blur(20px)",
      ease: "power2.inOut",
    }, 0.4);

    tl.to(text2Ref.current, {
      opacity: 0,
      y: -150,
      filter: "blur(20px)",
      ease: "power2.inOut",
    }, 0.4);

    tl.fromTo(layer3Ref.current,
      { scale: 0.4, opacity: 0, filter: "blur(40px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.inOut" },
      0.4
    );

    tl.fromTo(text3Ref.current,
      { opacity: 0, y: 150, filter: "blur(40px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" },
      0.55
    );

    // 66.6% to 100%: Lens Sustain Layer 3
    tl.to(layer3Ref.current, {
      scale: 1.15,
      ease: "none"
    }, 0.8);

  }, { scope: containerRef, dependencies: [showContent] });

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-saffron/30">
      
      {/* PHASE 1: THE MOVIE TITLE REVEAL OVERLAY */}
      {!showContent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
          <div className="title-overlay text-center px-4">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase shimmer-glow leading-none">
              <CharSplitter text={location || "INDIA"} charClassName="char" />
            </h1>
            <p className="mt-8 text-lg md:text-xl tracking-[1em] text-saffron uppercase font-light opacity-50 block">
              A Cinematic Journey
            </p>
          </div>
        </div>
      )}

      {/* PHASE 2 & 3: CLASSIC 3D ZOOM-THROUGH (FIXED GAP VERSION) */}
      <div className={`story-scroll-container relative w-full h-[450vh] bg-[#020202] transition-opacity duration-1500 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="sticky top-0 w-full h-screen overflow-hidden perspective-[1200px]">
          
          {/* Back Button (Fixed and always reachable) */}
          <button 
            onClick={onBack}
            className="fixed top-8 left-8 z-[201] flex items-center space-x-2 text-white/70 hover:text-white transition-all glass-panel px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Exit Tour</span>
          </button>

          {/* CINEMATIC DUST/PARTICLES (Depth Layers) */}
          <div className="absolute inset-0 z-40 pointer-events-none select-none">
            <div className="particle-layer absolute top-[20%] left-[10%] w-2 h-2 bg-white/20 rounded-full blur-[2px]"></div>
            <div className="particle-layer absolute top-[60%] right-[15%] w-3 h-3 bg-indigo-500/10 rounded-full blur-[4px]"></div>
            <div className="particle-layer absolute bottom-[30%] left-[40%] w-1 h-1 bg-saffron/20 rounded-full blur-[1px]"></div>
          </div>

          {/* LAYER 3: CULTURE (The Final Layer) */}
          <div 
            ref={layer3Ref} 
            className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-10"
            style={{ backgroundImage: `url('${assets.culture}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          {/* LAYER 2: FOOD (The Middle Layer) */}
          <div 
            ref={layer2Ref} 
            className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-20"
            style={{ backgroundImage: `url('${assets.food}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20"></div>
          </div>

          {/* LAYER 1: LANDSCAPE (The Opening Layer) */}
          <div 
            ref={layer1Ref} 
            className="absolute inset-0 w-full h-full bg-cover bg-center object-cover will-change-transform z-30"
            style={{ backgroundImage: `url('${assets.landscape}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
          </div>

          {/* TEXT OVERLAYS: BLUR-TO-FOCUS SCRIPT */}
          <div className="absolute inset-0 z-40 flex items-center justify-center p-8 text-center mix-blend-screen pointer-events-none">
            
            {/* Text 1: Landscape */}
            <div ref={text1Ref} className="absolute flex flex-col items-center justify-center w-full px-4">
              <p className="text-saffron font-bold tracking-[0.4em] uppercase text-xs mb-6 opacity-70">Entering</p>
              <h2 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-none shimmer-glow drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                {location}
              </h2>
              <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl font-light">Explore the timeless echoes and architectural wonders.</p>
              <div className="mt-16 animate-bounce w-[2px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>

            {/* Text 2: Food */}
            <div ref={text2Ref} className="absolute flex flex-col items-center justify-center w-full px-4 opacity-0 scale-90">
               <span className="text-saffron text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-80">The Senses</span>
              <h3 className="text-5xl md:text-8xl font-black text-white tracking-tight italic drop-shadow-2xl">Culinary Soul</h3>
              <p className="mt-8 text-lg text-gray-200 max-w-2xl font-light leading-relaxed">Centuries of tradition preserved through flavor and sacred ritual.</p>
            </div>

            {/* Text 3: Culture */}
            <div ref={text3Ref} className="absolute flex flex-col items-center justify-center w-full px-4 opacity-0 scale-90">
               <span className="text-saffron text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-80">The Heart</span>
              <h4 className="text-6xl md:text-9xl font-extrabold text-white tracking-tighter uppercase leading-none">Eternal Spirit</h4>
              <p className="mt-10 text-xl text-gray-400 max-w-2xl italic leading-relaxed">The Odyssey concludes where the spirit of the land is immortalized.</p>
              <button 
                onClick={onBack}
                className="mt-16 px-14 py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-saffron hover:scale-105 transition-all pointer-events-auto shadow-[0_0_50px_rgba(255,255,255,0.25)] text-sm"
              >
                Return to Map
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StoryMode;
