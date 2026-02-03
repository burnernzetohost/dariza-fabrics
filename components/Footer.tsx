import { Instagram, Facebook, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#012d20] text-[#DCf9f1] py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2">IGNITE MIDAS</p>
            <p className="text-xs text-[#DCf9f1]/60">All rights reserved.</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-[#DCf9f1]/20 mx-4"></div>
          <a href="/about" className="text-xs text-[#DCf9f1]/70 hover:text-white transition uppercase tracking-wider">
            About Us
          </a>
          <div className="hidden md:block w-px h-8 bg-[#DCf9f1]/20 mx-4"></div>
          <a href="/contact" className="text-xs text-[#DCf9f1]/70 hover:text-white transition uppercase tracking-wider">
            Contact Us
          </a>
          <div className="hidden md:block w-px h-8 bg-[#DCf9f1]/20 mx-4"></div>
          <a href="/cancellation-exchange" className="text-xs text-[#DCf9f1]/70 hover:text-white transition uppercase tracking-wider">
            Cancellation Policy
          </a>
          <div className="hidden md:block w-px h-8 bg-[#DCf9f1]/20 mx-4"></div>
          <a href="/shipping-policy" className="text-xs text-[#DCf9f1]/70 hover:text-white transition uppercase tracking-wider">
            Shipping Policy
          </a>
        </div>

        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/darizafabrics/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#DCf9f1]/70 transition"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61582389920643&rdid=2nzFcrLbsyIKIVuF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CjEGy9h9T%2F#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#DCf9f1]/70 transition"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=919055569991&text=Hi+Dariza+Fabrics%2C+I+have+a+query.&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#DCf9f1]/70 transition"
            aria-label="WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}