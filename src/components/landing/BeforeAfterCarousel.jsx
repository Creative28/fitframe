import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAIRS = [
  {
    label: 'Yellow Shirt',
    before: { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/5961e2c8e_generated_image.png', alt: 'Yellow shirt flat lay' },
    after:  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/5e49e4a3e_generated_image.png', alt: 'Model wearing yellow shirt' },
  },
  {
    label: 'Blue Jeans',
    before: { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/ecfee6255_generated_image.png', alt: 'Blue jeans flat lay' },
    after:  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/949051cf7_generated_image.png', alt: 'Model wearing blue jeans' },
  },
  {
    label: 'Shirt & Pants Outfit',
    before: { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/93f2a8f32_generated_image.png', alt: 'Shirt and pants laid out' },
    after:  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/9f7db745a_generated_image.png', alt: 'Model wearing shirt and pants' },
  },
  {
    label: 'Black Dress',
    before: { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/c984c9798_generated_image.png', alt: 'Black dress flat lay' },
    after:  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/119d11998_generated_image.png', alt: 'Model wearing black dress' },
  },
  {
    label: 'Bathing Suit',
    before: { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/19a827d97_generated_image.png', alt: 'Pink bikini flat lay' },
    after:  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b7303524165a13c96d4537/67b6e4c96_generated_image.png', alt: 'Model wearing pink bikini' },
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-3 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="relative">
              <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-dm z-10">Before</div>
              <img
                src={pair.before.src}
                alt={pair.before.alt}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
            <div className="relative">
              <div className="absolute top-3 left-3 bg-[#E8B86D] text-[#1A1A2E] text-xs px-2.5 py-1 rounded-full font-dm font-semibold z-10">After ✦</div>
              <img
                src={pair.after.src}
                alt={pair.after.alt}
                className="w-full h-64 sm:h-80 object-cover"
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