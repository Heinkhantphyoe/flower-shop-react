import { Link } from 'react-router-dom';
import { Flower2, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

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

const socialIcons = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'Twitter', icon: Twitter },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-2">
              <span className="p-2 bg-emerald-600 rounded-full">
                <Flower2 className="w-5 h-5 text-white" />
              </span>
              <span className="text-xl font-semibold text-gray-900">FlowerShop</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Luxury floral arrangements crafted with passion and delivered fresh to brighten every moment.
            </p>
            <div className="mt-5 flex items-center space-x-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2.5">
              {accountLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>123 Blossom Street, Flower City</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="tel:+15551234567" className="hover:text-emerald-600 transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="mailto:hello@flowershop.com" className="hover:text-emerald-600 transition-colors">hello@flowershop.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FlowerShop. All rights reserved.</p>
          <p>Made with care for flower lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;