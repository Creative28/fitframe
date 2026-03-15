import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAIRS = [
  {
    before: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=600&fit=crop&crop=center',
      alt: 'White sweatshirt laid flat on bed',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=500&h=600&fit=crop&crop=top',
      alt: 'Model wearing white sweatshirt',
    },
  },
  {
    before: {
      src: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=500&h=600&fit=crop&crop=center',
      alt: 'Black dress hanging on door',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop&crop=top',
      alt: 'Model wearing black dress',
    },
  },
  {
    before: {
      src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop&crop=center',
      alt: 'Blue jeans folded on wooden floor',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop&crop=top',
      alt: 'Model wearing blue jeans',
    },
  },
];

export default function BeforeAfterCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % PAIRS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const pair = PAIRS[current];

  return (
    <div className="max-w-xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-3 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="relative">
              <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-dm z-10">Before</div>
              <img
                src={pair.before.src}
                alt={pair.before.alt}
                className="w-full h-60 sm:h-72 object-cover"
              />
            </div>
            <div className="relative">
              <div className="absolute top-3 left-3 bg-[#E8B86D] text-[#1A1A2E] text-xs px-2.5 py-1 rounded-full font-dm font-semibold z-10">After ✨</div>
              <img
                src={pair.after.src}
                alt={pair.after.alt}
                className="w-full h-60 sm:h-72 object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {PAIRS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current ? 'w-6 h-2 bg-[#E8B86D]' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 font-dm mt-3 italic">
        Real example — generated in 10 seconds
      </p>
    </div>
  );
}