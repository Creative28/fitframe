import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Upload, Cpu, Download, Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: 19,
    credits: 30,
    features: ['30 credits/month', 'HD photo downloads', 'All AI models', 'Email support'],
  },
  {
    name: 'Growth',
    price: 49,
    credits: 150,
    features: ['150 credits/month', 'Unlimited try-on links', 'Customer try-ons', 'Priority support'],
    popular: true,
  },
  {
    name: 'Pro',
    price: 99,
    credits: 'Unlimited',
    features: ['Unlimited everything', 'API access', 'Custom branding', 'Dedicated support'],
  },
];

const STEPS = [
  { icon: Upload, step: '01', title: 'Upload your item', desc: 'Any photo — hanger, flat-lay, or mannequin' },
  { icon: Cpu, step: '02', title: 'Pick your model', desc: 'Choose from 12+ diverse AI fashion models' },
  { icon: Download, step: '03', title: 'Download and sell', desc: 'Professional model photos in 10 seconds' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-dm">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-playfair text-2xl font-bold text-[#1A1A2E]">FitFrame</span>
        <button
          onClick={() => base44?.auth?.redirectToLogin()}
          className="px-4 py-2 text-sm font-medium text-[#1A1A2E] hover:underline"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8B86D]/15 text-[#1A1A2E] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={14} className="text-[#E8B86D]" />
            5 free photos on signup — no card needed
          </div>
          <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-[#1A1A2E] leading-tight mb-4">
            Your clothes deserve<br /><em>better photos.</em>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Turn any product photo into a professional model shot in 10 seconds. No photographer. No model fees.
          </p>
          <button
            onClick={() => window.location.href = '/studio'}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold hover:bg-[#2a2a4e] transition-colors"
          >
            Try it free — 5 photos on us
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Before/after */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto rounded-3xl overflow-hidden shadow-xl">
          <div className="relative">
            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-dm">Before</div>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop"
              alt="Hanger product photo"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
          <div className="relative">
            <div className="absolute top-3 left-3 bg-[#E8B86D] text-[#1A1A2E] text-xs px-2.5 py-1 rounded-full font-dm font-semibold">After ✨</div>
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop"
              alt="Professional model photo"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A2E]">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4 p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E] flex items-center justify-center">
                <Icon size={28} className="text-[#E8B86D]" />
              </div>
              <div>
                <p className="text-xs font-dm font-semibold text-[#E8B86D] tracking-widest mb-1">{step}</p>
                <h3 className="font-playfair text-xl font-bold text-[#1A1A2E]">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Try-On feature */}
      <section className="px-6 py-16 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A2E] rounded-3xl p-8 sm:p-12 text-white text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h2 className="font-playfair text-3xl font-bold mb-4">For your customers too</h2>
            <p className="text-white/70 text-lg max-w-lg mx-auto mb-6 leading-relaxed">
              Share a try-on link with your customers. They upload their photo and instantly see themselves wearing your item — before they buy. Fewer returns, more sales.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm font-dm">
              {['No app download', 'Works in any browser', 'Zero effort for buyer', 'Drives conversions'].map(f => (
                <span key={f} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Check size={13} className="text-[#E8B86D]" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Simple pricing</h2>
            <p className="text-gray-500 mt-2">Start for free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border-2 ${
                  plan.popular ? 'border-[#E8B86D] bg-[#1A1A2E] text-white' : 'border-gray-100 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8B86D] text-[#1A1A2E] text-xs font-semibold px-3 py-1 rounded-full font-dm">
                    Most Popular
                  </span>
                )}
                <h3 className={`font-playfair text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[#1A1A2E]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`font-playfair text-4xl font-bold ${plan.popular ? 'text-white' : 'text-[#1A1A2E]'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-gray-400'}`}>/mo</span>
                </div>
                <div className={`flex items-center gap-1.5 mb-4 text-sm font-medium ${plan.popular ? 'text-[#E8B86D]' : 'text-[#E8B86D]'}`}>
                  <Sparkles size={14} />
                  {plan.credits} credits/month
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      <Check size={14} className="text-[#E8B86D] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => window.location.href = '/studio'}
                  className={`w-full py-3 rounded-xl font-dm font-semibold text-sm transition-colors ${
                    plan.popular
                      ? 'bg-[#E8B86D] text-[#1A1A2E] hover:bg-[#d4a55e]'
                      : 'bg-[#1A1A2E] text-white hover:bg-[#2a2a4e]'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 font-dm mt-6">Every new account gets 5 free credits — no credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center">
        <span className="font-playfair text-lg font-bold text-[#1A1A2E]">FitFrame</span>
        <p className="text-sm text-gray-400 font-dm mt-1">AI fashion studio for sellers</p>
      </footer>
    </div>
  );
}