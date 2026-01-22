export default function WinterSale() {
  return (
    <section className="bg-[#012d20] py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        <h2 className="font-serif text-5xl md:text-6xl text-[#DCf9f1] leading-tight">
          WINTER <br /> <span className="font-bold">SALE</span>
        </h2>
        <div className="text-left border-l border-[#DCf9f1]/30 pl-8">
          <p className="text-[#DCf9f1]/80 text-sm mb-6 max-w-xs">
            Take 50% off a range of goods in our end of season sale. All sales final - ends soon!
          </p>
          <button className="bg-[#DCf9f1] text-[#012d20] px-8 py-3 text-xs uppercase tracking-widest hover:bg-white transition-colors">
            Shop Sale
          </button>
        </div>
      </div>
    </section>
  );
}