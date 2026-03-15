const AVATARS = [
  {
    initials: 'SM',
    name: 'Sarah M.',
    handle: 'Depop seller',
    color: 'bg-pink-400',
  },
  {
    initials: 'LB',
    name: 'Luna Boutique',
    handle: 'Instagram',
    color: 'bg-purple-400',
  },
  {
    initials: 'JK',
    name: 'Jessica K.',
    handle: 'Poshmark reseller',
    color: 'bg-amber-400',
  },
];

export default function SocialProof() {
  return (
    <div className="max-w-xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
      {/* Avatars + count */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {AVATARS.map((a) => (
            <div
              key={a.initials}
              className={`w-9 h-9 rounded-full ${a.color} border-2 border-white flex items-center justify-center text-white text-xs font-bold font-dm`}
            >
              {a.initials}
            </div>
          ))}
        </div>
        <p className="text-sm font-dm text-gray-600 leading-snug">
          <span className="font-semibold text-[#1A1A2E]">2,400+</span> boutique owners<br />
          & resellers already using Just Fit It
        </p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-10 bg-gray-200" />

      {/* Names */}
      <div className="flex flex-col gap-1">
        {AVATARS.map((a) => (
          <div key={a.initials} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold font-dm`}>
              {a.initials}
            </div>
            <span className="text-xs font-dm text-gray-500">
              <span className="font-semibold text-[#1A1A2E]">{a.name}</span> — {a.handle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}