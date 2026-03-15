import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { label: 'Removing background…', duration: 3000 },
  { label: 'Fitting garment…', duration: 5000 },
  { label: 'Adjusting lighting…', duration: 4000 },
  { label: 'Almost ready…', duration: 3000 },
];

export default function GeneratingProgress({ isGenerating }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setStepIndex(0);
      setProgress(0);
      return;
    }

    let elapsed = 0;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);
    const interval = setInterval(() => {
      elapsed += 100;
      const pct = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(pct);

      let cumulative = 0;
      for (let i = 0; i < STEPS.length; i++) {
        cumulative += STEPS[i].duration;
        if (elapsed < cumulative) {
          setStepIndex(i);
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-[#FAFAF8]/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-8 px-8">
      <div className="w-20 h-20 rounded-full border-4 border-[#E8B86D]/30 border-t-[#E8B86D] animate-spin" />

      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="font-playfair text-2xl text-[#1A1A2E] font-semibold"
          >
            {STEPS[stepIndex]?.label}
          </motion.p>
        </AnimatePresence>
        <p className="text-gray-400 font-dm text-sm mt-2">This takes 5–17 seconds</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E8B86D] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-[#E8B86D]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}