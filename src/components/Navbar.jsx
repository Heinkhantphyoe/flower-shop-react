import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Contact, Flower, MapPin, Search, ShoppingBasketIcon, UserPen } from "lucide-react";



const NavBar = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle body overflow when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleLogout = () => dispatch(logout());

  // Navigation items data
  const mainNavItems = [
    { label: "Flowers", to: "/products?categoryId=1" },
    { label: "Gifts", to: "/products?categoryId=2" },
    { label: "Cakes", to: "/products?categoryId=3" },
    { label: "Discounts", to: "/discounts" },
    { label: "About Us", to: "/about-us" },
  ];
  const secondaryNavItems = [
    {
      name: "My Account",
      to: "/account",
      icon: <UserPen />
    },
    {
      name: "Contact Us",
      to: "/contact",
      icon: <Contact />
    }
  ];

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };


  return (
    <>
      {/* Floating navbar with glassmorphism */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${scrolled
        ? 'w-[95%] max-w-6xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-lg'
        : 'w-[98%] max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20'
        } rounded-2xl`}>

        <div className="relative px-6 py-3">
          <div className="flex justify-between items-center">

            {/* Location */}
            <div className="hidden sm:flex items-center gap-3 text-gray-600 group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-gray-800 font-medium">Myanmar</span>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white shadow-md">
                <Flower className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Gift</span>
                <span className="text-gray-900">ora</span>
              </span>
            </Link>

            {/* Right side icons */}
            <div className="flex items-center space-x-3">

              {/* Auth Button */}
              <div className="hidden sm:block">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/login">
                    <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                      Join Us
                    </button>
                  </Link>
                )}
              </div>

              {/* Cart Icon */}
              <button
                onClick={onCartClick}
                className="p-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all">
                <ShoppingBasketIcon />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </button>         
              
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all"
                >
                  <Search />
                </button>

                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-80 z-50 animate-in slide-in-from-top-2">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search for flowers..."
                          className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <div className="w-5 h-5 relative">
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all ${isOpen ? 'rotate-45 -translate-y-1/2' : '-translate-y-2'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all ${isOpen ? '-rotate-45 -translate-y-1/2' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex justify-center gap-1 py-3 mt-20">
        {mainNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="px-5 py-2 text-gray-600 hover:text-white font-medium hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:shadow-md rounded-xl transition-all"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-40" style={{ top: '5rem' }}>
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="relative h-full w-4/5 ml-auto bg-white/95 backdrop-blur-xl border-l border-white/30 shadow-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <div className="overflow-y-auto h-full pb-20 px-5 py-6 space-y-3">

                {/* Main Navigation */}
                {mainNavItems.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    <NavLink
                      to={item.to}
                      onClick={handleClose}
                      className="block text-lg px-4 py-3 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all"
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}

                <motion.div
                  className="my-4 h-px bg-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: mainNavItems.length * 0.05 + 0.1 }}
                />

                {/* Secondary Navigation */}
                {secondaryNavItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={mainNavItems.length + i}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    <NavLink
                      to={item.to}
                      onClick={handleClose}
                      className="block text-base px-4 py-3 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </NavLink>
                  </motion.div>
                ))}

                {/* Auth Button */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: (mainNavItems.length + secondaryNavItems.length) * 0.05 + 0.2,
                      duration: 0.4
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        handleClose();
                      }}
                      className="w-full px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Logout
                    </button>
                  ) : (
                    <NavLink to="/login" onClick={handleClose}>
                      <button className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                        Join Us
                      </button>
                    </NavLink>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;