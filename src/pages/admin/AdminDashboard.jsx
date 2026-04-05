import { useRef, useState, useEffect } from "react";
import { Bell, User, LogOut, Flower, Menu, X, BarChart3, Package, Users, Tag, LayoutDashboard } from "lucide-react";
import Product from "./Product";
import Orders from "./Orders";
import Customers from "./Customers";
import Profile from "./Profile";
import Analytic from "./Analytic";
import Category from "./Category";
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

// --- Page Components Mapping (for cleaner rendering) ---
const pages = {
    analytics: <Analytic />,
    products: <Product />,
    categories: <Category />,
    orders: <Orders />,
    customers: <Customers />,
    profile: <Profile />,
};

// --- Page Titles (for a nicer display in the header) ---
const pageTitles = {
    analytics: "Analytics Overview",
    products: "Manage Products",
    categories: "Product Categories",
    orders: "Manage Orders",
    customers: "Customer Directory",
    profile: "Profile & Settings",
};

export default function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState("analytics");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();


    // Effect to close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        dispatch(logout());  
        setIsDropdownOpen(false);
    };

    const sidebarItems = [
        { id: "analytics", name: "Analytics", icon: BarChart3 },
        { id: "products", name: "Products", icon: Flower },
        { id: "categories", name: "Categories", icon: Tag },
        { id: "orders", name: "Orders", icon: Package },
        { id: "customers", name: "Customers", icon: Users },
    ];

    return (
        // FIX 1: Changed min-h-screen to h-screen and added overflow-hidden
        <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
            {/* Sidebar */}
            {/* FIX 2: Added h-screen to make the sidebar always take full vertical space */}
            <aside className={`h-screen ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col`}>
                <div className="h-[73px] flex items-center justify-center border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Flower className="text-pink-600" size={sidebarOpen ? 32 : 28} />
                        {sidebarOpen && <h1 className="text-xl font-bold text-slate-800">BlossomAdmin</h1>}
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                currentPage === item.id
                                    ? 'bg-pink-50 text-pink-600 font-semibold border-l-4 border-pink-600'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.name}</span>}
                        </button>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-slate-200">
                     <button
                        onClick={() => setCurrentPage('profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            currentPage === 'profile'
                                ? 'bg-pink-50 text-pink-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <User size={20} />
                        {sidebarOpen && <span>Profile</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 bg-slate-50/75 backdrop-blur-lg px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-600 hover:bg-slate-200 p-2 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">
                            {pageTitles[currentPage]}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4" ref={dropdownRef}>
                        <Bell className="text-slate-500 cursor-pointer hover:text-pink-600 transition-colors" />
                        
                        <div className="relative">
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer shadow-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-100 z-50 origin-top-right"
                                    >
                                        <div className="p-2">
                                            <div className="px-2 py-2 mb-1">
                                                <p className="font-semibold text-slate-800">Admin User</p>
                                                <p className="text-sm text-slate-500 truncate">admin@flowerstore.com</p>
                                            </div>
                                            <div className="border-t border-slate-200"></div>
                                            <button onClick={() => { setCurrentPage('profile'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left mt-1 px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"><User size={16} className="mr-2" /> My Profile</button>
                                            <button onClick={handleLogout} className="flex items-center w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"><LogOut size={16} className="mr-2" /> Logout</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {pages[currentPage]}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}