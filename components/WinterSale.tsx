'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function WinterSale() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`bg-white py-20 px-4 text-center border-t border-b border-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        <h2 className="font-serif text-5xl md:text-6xl text-black leading-tight">
          WINTER <br /> <span className="font-bold">SALE</span>
        </h2>
        <div className="text-left border-l border-gray-300 pl-8">
          <p className="text-gray-600 text-sm mb-6 max-w-xs">
            Take 50% off a range of goods in our end of season sale. All sales final - ends soon!
          </p>
          <button className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Shop Sale
          </button>
        </div>
      </div>
    </section>
  );
}
