import { useState, useEffect } from 'react';

export default function TextAnimation() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalPhases = 7;

  useEffect(() => {
    if (!isPlaying) return;
    
    const delays = {
      0: 1200,
      1: 400,
      2: 400,
      3: 400,
      4: 400,
      5: 2000,
      6: 100,
    };
    
    const timer = setTimeout(() => {
      setPhase((prev) => (prev + 1) % totalPhases);
    }, delays[phase] || 500);
    
    return () => clearTimeout(timer);
  }, [phase, isPlaying]);

  const letters = ['m', 'e', 'g', 'i', '\u00A0', 'i', 'a'];

  const collapsePhase = {
    0: 1,
    1: 2,
    2: 3,
    6: 4,
  };

  const getLetterStyle = (letter, index) => {
    const baseStyle = {
      display: 'inline-block',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '700',
      fontSize: 'clamp(48px, 15vw, 120px)',
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      position: 'absolute',
    };

    const isFirstI = index === 3;
    const isSecondI = index === 5;

    const letterWidths = [0.82, 0.54, 0.54, 0.24, 0.30, 0.24, 0.54];

    // +15% spacing between pairs: m-e(0), e-g(1), g-i(2), i-a(5)
    const SPACING_INCREASE = 0.15;
    const pairsWithMoreSpace = new Set([0, 1, 2, 5]);

    const extraBetween = new Array(letterWidths.length - 1).fill(0);
    for (const pair of pairsWithMoreSpace) {
      extraBetween[pair] = SPACING_INCREASE * ((letterWidths[pair] + letterWidths[pair + 1]) / 2);
    }

    const totalWidth = letterWidths.reduce((a, b) => a + b, 0) + extraBetween.reduce((a, b) => a + b, 0);

    let xPos = 0;
    for (let i = 0; i < index; i++) {
      xPos += letterWidths[i];
      if (i < extraBetween.length) xPos += extraBetween[i];
    }

    const LAYOUT_SCALE_PX = 120;
    const initialX = (xPos - totalWidth / 2 + letterWidths[index] / 2) * LAYOUT_SCALE_PX;

    // Final centered positions for i's
    const adjustedCenterFirstI = 10;
    const adjustedCenterSecondI = 70;

    const shouldCollapse = collapsePhase[index] !== undefined && phase >= collapsePhase[index];
    const firstIShouldMove = phase >= 3;
    const secondIShouldMove = phase >= 4;

    if (phase === 0 || phase === 6) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: `translateX(${initialX}px) translateY(0) scale(1) rotate(0deg)`,
        filter: 'blur(0px)',
      };
    }

    if (isFirstI) {
      const targetX = firstIShouldMove ? adjustedCenterFirstI : initialX;
      return {
        ...baseStyle,
        opacity: 1,
        transform: `translateX(${targetX}px) translateY(0) scale(1) rotate(0deg)`,
        filter: 'blur(0px)',
        zIndex: 10,
      };
    }

    if (isSecondI) {
      const targetX = secondIShouldMove ? adjustedCenterSecondI : initialX;
      return {
        ...baseStyle,
        opacity: 1,
        transform: `translateX(${targetX}px) translateY(0) scale(1) rotate(0deg)`,
        filter: 'blur(0px)',
        zIndex: 10,
      };
    }

    if (index === 4) {
      const shouldHide = phase >= 3;
      return {
        ...baseStyle,
        opacity: shouldHide ? 0 : 1,
        transform: `translateX(${initialX}px) translateY(0) scale(${shouldHide ? 0 : 1})`,
      };
    }

    if (shouldCollapse) {
      const targetX = index < 4 ? adjustedCenterFirstI : adjustedCenterSecondI;

      return {
        ...baseStyle,
        opacity: 0,
        transform: `translateX(${targetX}px) translateY(0) scale(0.1) rotate(${index < 4 ? -10 : 10}deg)`,
        filter: 'blur(6px)',
      };
    }

    return {
      ...baseStyle,
      opacity: 1,
      transform: `translateX(${initialX}px) translateY(0) scale(1) rotate(0deg)`,
      filter: 'blur(0px)',
    };
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" 
        rel="stylesheet"
      />
      
      <div 
        className="relative flex items-center justify-center"
        style={{ minHeight: '200px', width: '100%' }}
      >
        <div 
          className="relative flex items-center justify-center"
          style={{ width: '600px', height: '150px' }}
        >
          {letters.map((letter, index) => (
            <span key={index} style={getLetterStyle(letter, index)}>
              {letter}
            </span>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 flex gap-4">
        <button
          onClick={() => { setPhase(0); setIsPlaying(true); }}
          className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Reiniciar
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-3 bg-gray-100 text-black rounded-full font-medium hover:bg-gray-200 transition-colors shadow-lg border border-gray-200"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isPlaying ? 'Pausar' : 'Continuar'}
        </button>
      </div>

      <div className="fixed top-8 flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((p) => (
          <div
            key={p}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              phase >= p && phase < 6 ? 'bg-black' : 'bg-gray-300'
            } ${phase === p ? 'scale-150' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
