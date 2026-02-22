'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function PromoStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`bg-white py-6 px-4 border-b border-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
        <span className="font-serif text-xl tracking-widest font-bold text-[#01321F]">EXAMPLE SALE COUNTDOWN</span>

        <div className="flex gap-4 font-mono text-sm text-gray-500">
          <div className="text-center"><span className="block text-[#01321F] font-bold">29</span>Days</div>
          <div className="text-center"><span className="block text-[#01321F] font-bold">22</span>Hours</div>
          <div className="text-center"><span className="block text-[#01321F] font-bold">33</span>Mins</div>
          <div className="text-center"><span className="block text-[#01321F] font-bold">40</span>Secs</div>
        </div>

        <button className="bg-black text-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
}
