import { motion } from 'framer-motion';

const ITEMS = [
  '✓ Depop sellers',
  '✓ Poshmark resellers',
  '✓ Instagram boutiques',
  '✓ Etsy shops',
  '✓ Shopify stores',
  '✓ WhatsApp sellers',
  '✓ Facebook Marketplace',
  '✓ Vinted sellers',
];

export default function MarqueeStrip() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden bg-[#1A1A2E]/5 border-y border-[#1A1A2E]/10 py-2.5 mb-6">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-sm font-dm font-medium text-[#1A1A2E]/70 flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}