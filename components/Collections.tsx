import Link from 'next/link';

const categories = [
  // Added 'link' property here 👇
  { name: 'Coats', items: '77 Items', img: '/coats/coat1.jpeg', link: '/coats' },
  { name: 'Shawl', items: '77 Items', img: '/shawl/shawl2.jpeg', link: '/shawls' },
  { name: 'Saree', items: '77 Items', img: '/saree/saree1.jpeg', link: '/saree' },
];

export default function Collections() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <h2 className="text-center font-serif text-4xl mb-12 text-[#012d20]">Shop by Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          // Wrapped in Link 👇
          <Link key={cat.name} href={cat.link} className="group cursor-pointer block">
            <div className="relative h-[500px] overflow-hidden bg-gray-100">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="font-bold text-sm uppercase tracking-wide text-black">{cat.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{cat.items}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}