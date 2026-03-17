export default function TryOnDemo() {
  const sellerPhoto = 'https://media.base44.com/images/public/69b7303524165a13c96d4537/ee1c7856b_generated_image.png';
  const customerPhoto = 'https://media.base44.com/images/public/69b7303524165a13c96d4537/0721b3aa5_generated_image.png';

  return (
    <div className="w-full py-4">
      {/* Headline */}
      <div className="text-center mb-8 px-4">
        <p className="font-playfair text-2xl sm:text-3xl font-bold text-[#1A1A2E] leading-tight">
          Your customer goes from wondering…
          <br />
          <span className="text-[#E8B86D]">to knowing in 10 seconds</span>
        </p>
      </div>

      {/* Phone mockups */}
      <div className="relative flex items-end justify-center gap-0 mb-6" style={{ minHeight: 380 }}>
        {/* LEFT PHONE */}
        <div className="relative z-10" style={{ transform: 'rotate(-4deg) translateX(18px)' }}>
          <PhoneFrame label="Seller's listing photo" sublabel="The seller's model photo">
            <img
              src={sellerPhoto}
              alt="Professional model in red wrap dress"
              className="w-full h-full object-cover object-top"
            />
          </PhoneFrame>
        </div>

        {/* Arrow + label in center */}
        <div className="relative z-20 flex flex-col items-center justify-center mb-10 mx-1" style={{ minWidth: 72 }}>
          <div className="bg-white border-2 border-[#E8B86D] rounded-full px-3 py-2 shadow-lg flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-dm font-bold text-[#1A1A2E] leading-none whitespace-nowrap">Try-On</span>
            <span className="text-[10px] font-dm font-bold text-[#E8B86D] leading-none">Link →</span>
          </div>
        </div>

        {/* RIGHT PHONE */}
        <div className="relative z-10" style={{ transform: 'rotate(4deg) translateX(-18px)' }}>
          <PhoneFrame label="After using the try-on link" sublabel="What the customer sees">
            <img
              src={customerPhoto}
              alt="Everyday woman in red wrap dress"
              className="w-full h-full object-cover object-top"
            />
          </PhoneFrame>
        </div>
      </div>

      {/* Steps */}
      <div className="text-center px-4 mb-6">
        <div className="inline-flex flex-wrap justify-center gap-1 text-sm font-dm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[#1A1A2E] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
            She uploads her photo
          </span>
          <span className="text-[#E8B86D] font-bold mx-1">→</span>
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[#1A1A2E] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
            sees herself in your dress
          </span>
          <span className="text-[#E8B86D] font-bold mx-1">→</span>
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[#E8B86D] text-[#1A1A2E] text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
            buys with confidence
          </span>
        </div>
      </div>

      {/* Quote */}
      <div className="mx-4 bg-gradient-to-br from-[#1A1A2E] to-[#2a2a4e] rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-3 left-4 text-[#E8B86D] text-5xl font-serif leading-none opacity-30 select-none">"</div>
        <p className="font-dm text-sm leading-relaxed text-white/90 relative z-10 pt-3">
          I sent my customer a try-on link for this dress. She tried it on, loved it, and bought it in{' '}
          <span className="text-[#E8B86D] font-semibold">2 minutes</span>. No back and forth. No returns.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-7 h-7 rounded-full bg-[#E8B86D] flex items-center justify-center text-[#1A1A2E] font-bold text-xs flex-shrink-0">S</div>
          <div>
            <p className="text-xs font-dm font-semibold text-white">Sarah M.</p>
            <p className="text-[10px] font-dm text-white/50">Depop seller, Texas</p>
          </div>
          <div className="ml-auto flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#E8B86D] text-xs">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ children, label, sublabel }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide text-center max-w-[120px]">{sublabel}</p>
      {/* Phone shell */}
      <div
        className="relative bg-[#1A1A2E] rounded-[28px] shadow-2xl overflow-hidden border-4 border-[#1A1A2E]"
        style={{ width: 130, height: 260 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1A1A2E] rounded-b-xl z-10" />
        {/* Screen */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden bg-gray-100">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full z-10" />
      </div>
      {/* Label */}
      <p className="text-xs font-dm font-semibold text-[#1A1A2E] text-center max-w-[120px] leading-tight">{label}</p>
    </div>
  );
}