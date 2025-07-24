import { useState, useEffect, useRef } from "react";
// Note: In your app, import these from react-redux and react-router-dom
// import { useDispatch, useSelector } from "react-redux";
// import { Link, NavLink } from "react-router-dom";
// import { logout } from "../features/auth/AuthSlice";

// Mock components and hooks for demo
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);
const NavLink = ({ to, children, className, onClick, ...props }) => (
  <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} onClick={onClick} {...props}>{children}</a>
);
const useDispatch = () => () => {};
const useSelector = () => ({ isAuthenticated: false });
const logout = () => ({ type: 'LOGOUT' });

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const searchRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse movement for glassmorphism effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle menu open/close
  useEffect(() => {
    let timer;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      timer = setTimeout(() => setMenuItemsVisible(true), 50);
    } else {
      document.body.style.overflow = 'auto';
      setMenuItemsVisible(false);
    }
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setMenuItemsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Floating navbar with glassmorphism */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled 
          ? 'w-[95%] max-w-6xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-black/10' 
          : 'w-[98%] max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl'
      } rounded-2xl`}>
        
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 p-[1px]">
          <div className="w-full h-full bg-white/80 backdrop-blur-xl rounded-2xl" />
        </div>

        <div className="relative z-10 px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Left - Location with modern styling */}
            <div className="text-gray-600 text-sm hidden sm:flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-gray-800 font-medium">Myanmar</span>
            </div>

            {/* Center - Modern Logo */}
            <Link to="/" className="group flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Gift</span>
                <span className="text-gray-900">ora</span>
              </div>
            </Link>

            {/* Right side - Modern Icons */}
            <div className="flex items-center space-x-3">
              
              {/* Auth Button */}
              <div className="hidden sm:block">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="group relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10">Logout</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ) : (
                  <Link to="/login">
                    <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                      <span className="relative z-10">Join Us</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Modern Cart Icon */}
              <Link to="/cart" className="group relative p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  3
                </span>
              </Link>

              {/* Modern Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="group p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Modern Search Box */}
                {showSearch && (
                  <div className="absolute right-0 top-full mt-3 w-80 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-4">
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            placeholder="Search for beautiful flowers..."
                            className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                          />
                          <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modern Hamburger Menu */}
              <div className="md:hidden">
                <button
                  onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                  className="group p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <div className="relative w-5 h-5">
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 -translate-y-1/2' : '-translate-y-2'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1/2' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Desktop Navigation Links */}
      <div className="hidden md:flex justify-center gap-1 py-4 mt-24 mb-1">
        {["Flowers", "Plants", "Gifts", "Discounts", "About Us"].map((item, i) => (
          <Link
            key={i}
            to={`/${item.toLowerCase().replace(' ', '-')}`}
            className="group relative px-6 py-3 text-gray-600 hover:text-white font-medium tracking-wide transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 transform hover:scale-105"
          >
            <span className="relative z-10">{item}</span>
            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>

      {/* Modern Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ top: '6rem' }}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        
        {/* Menu Panel */}
        <div className={`relative h-full w-full ml-auto bg-white/95 backdrop-blur-xl border-l border-white/30 shadow-2xl transform transition-all duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
    
          <div className="overflow-y-auto h-full w-full  pb-32">
            <div className="px-6 py-8 space-y-2">
              
              {/* Main Navigation */}
              {["Flowers", "Plants", "Gifts", "Discounts", "About Us"].map((item, index) => (
                <NavLink
                  key={index}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `group block text-lg transition-all duration-300 rounded-xl px-4 py-3 transform ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg' 
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:shadow-lg'
                    } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                  }
                  style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-current opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{item}</span>
                  </div>
                </NavLink>
              ))}

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              {/* Additional Links */}
              <div className="space-y-2">
                <NavLink
                  to="/account"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `group block text-base px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600'
                    } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                  }
                  style={{ transitionDelay: '350ms' }}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Account</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `group block text-base px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-green-500 to-teal-600 shadow-lg' 
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-600'
                    } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                  }
                  style={{ transitionDelay: '400ms' }}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Contact Us</span>
                  </div>
                </NavLink>
              </div>

              {/* Auth Section */}
              <div className={`pt-6 transition-all duration-300 ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '450ms' }}>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                ) : (
                  <NavLink to="/login" onClick={handleClose}>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Join Us</span>
                      </div>
                    </button>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;