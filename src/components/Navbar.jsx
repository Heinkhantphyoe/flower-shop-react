import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../features/auth/AuthSlice";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Location */}
            <div className="text-gray-600 text-sm hidden sm:flex justify-between items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a39f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>              <span className="text-gray-800 ">Myanmar</span>
            </div>

            {/* Center - Logo/Brand */}
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-primary">Gift</span>ora
            </Link>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                {isAuthenticated ?
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  >
                    Logout
                  </button>
                  :
                  <Link to="/login">
                    <button className="bg-primary text-white px-4 py-1.5 rounded-full text-sm shadow hover:shadow-md transition-all duration-200 hover:from-pink-600 hover:to-pink-700">
                      Register/Login
                    </button>
                  </Link>
                }
              </div>


              {/* Cart Icon */}
              <Link to="/cart" className="relative text-gray-700 hover:text-pink-600 transition p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Search Icon and Search Box */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-700 hover:text-pink-600 transition p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Desktop Search Box */}
                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-md  z-50">
                    <form onSubmit={handleSearch} className="">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="mt-3 w-full pl-3 pr-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-600"
                        >

                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>



              {/* Mobile menu toggle */}
              <div className="md:hidden ml-2">
                <button
                  onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                  className="text-gray-700 hover:text-pink-600 transition p-1"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <div className="relative w-6 h-6">
                    <span className={`absolute top-1/2 left-0 w-full h-[2px] bg-current transform transition duration-300 ${isOpen ? 'rotate-45 -translate-y-1/2' : '-translate-y-2'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-[2px] bg-current transition duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute top-1/2 left-0 w-full h-[2px] bg-current transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-1/2' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Links */}
      <div className="hidden md:flex justify-center gap-8 py-3 uppercase text-xs tracking-wider bg-white border-t border-gray-100">
        {["Flowers", "Plants", "Gifts", "Discounts", "About Us"].map((item, i) => (
          <Link
            key={i}
            to={`/${item.toLowerCase().replace(' ', '-')}`}
            className="text-gray-600 hover:text-pink-600 transition duration-200 font-medium"
          >
            {item}
          </Link>
        ))}
      </div>


      <div className={`md:hidden fixed inset-0 z-40 bg-white ${isOpen ? 'block' : 'hidden'}`} style={{ top: '4rem' }}>
        <div className="h-full w-full overflow-y-auto">
          <div className="px-6 py-8 space-y-6">

            {["Flowers", "Plants", "Gifts", "Discounts", "About Us"].map((item, index) => (
              <NavLink
                key={index}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                onClick={handleClose}
                className={({ isActive }) =>
                  `block text-lg transition-all duration-300 rounded px-3 py-2 ${isActive ? 'text-pink-600 font-semibold bg-pink-50' : 'text-gray-700 hover:text-pink-600'
                  } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                }
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {item}
              </NavLink>
            ))}

            {/* Additional mobile-only links */}
            <div className="pt-8 border-t border-gray-200 mt-8 space-y-4">
              <NavLink
                to="/account"
                onClick={handleClose}
                className={({ isActive }) =>
                  `block text-base px-3 py-2 rounded transition-all duration-300 ${isActive ? 'text-pink-600 font-medium bg-pink-50' : 'text-gray-700 hover:text-pink-600'
                  } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                }
                style={{ transitionDelay: '600ms' }}
              >
                My Account
              </NavLink>

              <NavLink
                to="/contact"
                onClick={handleClose}
                className={({ isActive }) =>
                  `block text-base px-3 py-2 rounded transition-all duration-300 ${isActive ? 'text-pink-600 font-medium bg-pink-50' : 'text-gray-700 hover:text-pink-600'
                  } ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                }
                style={{ transitionDelay: '650ms' }}
              >
                Contact Us
              </NavLink>


              <div
                className={`transition-all duration-300 ${menuItemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                style={{ transitionDelay: '700ms' }}
                onClick={handleClose}
              >
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink to="/login">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow transition-all duration-200 hover:shadow-md transform hover:scale-105">
                      Register/Login
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