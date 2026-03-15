import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAIRS = [
  {
    label: 'Yellow Shirt',
    before: { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop', alt: 'Yellow shirt laid flat' },
    after:  { src: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500&h=600&fit=crop&crop=top', alt: 'Model wearing yellow shirt' },
  },
  {
    label: 'Blue Jeans',
    before: { src: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&h=600&fit=crop', alt: 'Blue jeans flat lay' },
    after:  { src: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop&crop=top', alt: 'Model wearing blue jeans' },
  },
  {
    label: 'Shirt & Pants Outfit',
    before: { src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=600&fit=crop', alt: 'Shirt and pants outfit laid out' },
    after:  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop&crop=top', alt: 'Model wearing shirt and pants' },
  },
  {
    label: 'Black Dress',
    before: { src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop', alt: 'Black dress on hanger' },
    after:  { src: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=500&h=600&fit=crop&crop=top', alt: 'Model wearing black dress' },
  },
  {
    label: 'Bathing Suit',
    before: { src: 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=500&h=600&fit=crop', alt: 'Bathing suit flat lay' },
    after:  { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop&crop=top', alt: 'Model wearing bathing suit' },
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
              <div className="absolute top-3 left-3 bg-[#E8B86D] text-[#1A1A2E] text-xs px-2.5 py-1 rounded-full font-dm font-semibold z-10">After ✦</div>
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

      <div className="text-center mt-3">
        <p className="text-xs font-dm font-semibold text-[#E8B86D] tracking-widest uppercase mb-0.5">{pair.label}</p>
        <p className="text-sm text-gray-400 font-dm italic">Real example — generated in 10 seconds</p>
      </div>
    </div>
  );
}