import { Link } from 'react-router-dom';
import { Flower2, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Our Products', to: '/products' },
  { label: 'About Us', to: '/about-us' },
];

const accountLinks = [
  { label: 'My Profile', to: '/user/profile' },
  { label: 'My Orders', to: '/user/orders' },
  { label: 'Wishlist', to: '/wishlists' },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-black via-purple-950/40 to-black text-white overflow-hidden">
      {/* Top Gradient Accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <span className="p-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full shadow-lg">
                <Flower2 className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              </span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-violet-200">
                FlowerShop
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Luxury floral arrangements crafted with passion and delivered fresh to brighten every moment.
            </p>
            <div className="mt-5 flex items-center space-x-3">
              {[
                { href: '#', label: 'Facebook', icon: Facebook },
                { href: '#', label: 'Instagram', icon: Instagram },
                { href: '#', label: 'Twitter', icon: Twitter },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4">Account</h3>
            <ul className="space-y-2">
              {accountLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>123 Blossom Street, Flower City</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <a href="mailto:hello@flowershop.com" className="hover:text-white transition-colors">hello@flowershop.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} FlowerShop. All rights reserved.</p>
          <p className="flex items-center">
            Made with <Heart className="w-3.5 h-3.5 mx-1 text-pink-500 fill-current" /> for flower lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
