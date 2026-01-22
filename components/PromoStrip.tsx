export default function PromoStrip() {
  return (
    <div className="bg-[#012d20] py-6 px-4 border-b border-[#012d20]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
        <span className="font-serif text-xl tracking-widest font-bold text-[#DCf9f1]">EXAMPLE SALE COUNTDOWN</span>

        <div className="flex gap-4 font-mono text-sm text-[#DCf9f1]/80">
          <div className="text-center"><span className="block text-[#DCf9f1] font-bold">29</span>Days</div>
          <div className="text-center"><span className="block text-[#DCf9f1] font-bold">22</span>Hours</div>
          <div className="text-center"><span className="block text-[#DCf9f1] font-bold">33</span>Mins</div>
          <div className="text-center"><span className="block text-[#DCf9f1] font-bold">40</span>Secs</div>
        </div>

        <button className="bg-[#DCf9f1] text-[#012d20] px-6 py-2 text-xs uppercase tracking-wider hover:bg-white transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
}