import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ChevronLeft, ChevronRight, UserPlus, Star } from 'lucide-react';

// --- MOCK DATA (Replace with real data from your API) ---
const initialCustomers = [
    { id: 1, name: 'Olivia Chen', email: 'olivia.c@example.com', avatar: 'https://i.pravatar.cc/150?u=olivia', joinDate: '2025-08-15', lastOrderDate: '2025-09-19', totalOrders: 5, totalSpend: 285.50, recentOrders: [{id: '#1536', date: '2025-09-19', total: 45.00, status: 'Processing'}, {id: '#1492', date: '2025-08-28', total: 60.00, status: 'Delivered'}] },
    { id: 2, name: 'Liam Rodriguez', email: 'liam.r@example.com', avatar: 'https://i.pravatar.cc/150?u=liam', joinDate: '2025-06-20', lastOrderDate: '2025-09-19', totalOrders: 8, totalSpend: 640.00, recentOrders: [{id: '#1535', date: '2025-09-19', total: 80.00, status: 'Delivered'}] },
    { id: 3, name: 'Sophia Nguyen', email: 'sophia.n@example.com', avatar: 'https://i.pravatar.cc/150?u=sophia', joinDate: '2025-09-01', lastOrderDate: '2025-09-18', totalOrders: 2, totalSpend: 75.00, recentOrders: [{id: '#1534', date: '2025-09-18', total: 25.00, status: 'Delivered'}] },
    { id: 4, name: 'Noah Patel', email: 'noah.p@example.com', avatar: 'https://i.pravatar.cc/150?u=noah', joinDate: '2024-11-10', lastOrderDate: '2025-09-18', totalOrders: 15, totalSpend: 1250.00, recentOrders: [{id: '#1533', date: '2025-09-18', total: 120.00, status: 'Shipped'}] },
    { id: 5, name: 'Ava Kim', email: 'ava.k@example.com', avatar: 'https://i.pravatar.cc/150?u=ava', joinDate: '2025-09-17', lastOrderDate: '2025-09-17', totalOrders: 1, totalSpend: 15.00, recentOrders: [{id: '#1532', date: '2025-09-17', total: 15.00, status: 'Cancelled'}] },
    { id: 6, name: 'Jameson Lee', email: 'jameson.l@example.com', avatar: 'https://i.pravatar.cc/150?u=jameson', joinDate: '2025-02-05', lastOrderDate: '2025-09-16', totalOrders: 11, totalSpend: 890.75, recentOrders: [{id: '#1531', date: '2025-09-16', total: 72.50, status: 'Pending'}] },
];

const CUSTOMERS_PER_PAGE = 5;

// --- Animation Variants ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };

export default function Customers() {
    const [customers, setCustomers] = useState(initialCustomers);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSegment, setFilterSegment] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(c => {
                if (filterSegment === 'All') return true;
                if (filterSegment === 'New') return c.totalOrders <= 1;
                if (filterSegment === 'VIP') return c.totalSpend > 500;
                return true;
            });
    }, [customers, searchTerm, filterSegment]);

    const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);
    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * CUSTOMERS_PER_PAGE;
        return filteredCustomers.slice(startIndex, startIndex + CUSTOMERS_PER_PAGE);
    }, [filteredCustomers, currentPage]);

    const handleViewDetails = (customer) => { setSelectedCustomer(customer); setIsDetailsModalOpen(true); };
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const closeModals = () => { setIsDetailsModalOpen(false); setIsAddModalOpen(false); };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenAddModal} className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors">
                    <UserPlus className="w-5 h-5 mr-2" /> Add Customer
                </motion.button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <select value={filterSegment} onChange={e => setFilterSegment(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="All">All Segments</option>
                    <option value="New">New Customers</option>
                    <option value="VIP">VIP (Spend &gt; $500)</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                {['Customer', 'Join Date', 'Last Order', 'Total Orders', 'Total Spend', 'Actions'].map(h => <th key={h} className="p-4 text-sm font-semibold text-gray-500">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map((c) => (
                                <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">
                                        <div className="flex items-center space-x-3">
                                            <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <div>
                                                <p>{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{c.joinDate}</td>
                                    <td className="p-4 text-gray-600">{c.lastOrderDate}</td>
                                    <td className="p-4 text-gray-800 font-medium">{c.totalOrders}</td>
                                    <td className="p-4 text-green-600 font-bold">${c.totalSpend.toFixed(2)}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleViewDetails(c)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Showing {paginatedCustomers.length} of {filteredCustomers.length} customers</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><ChevronLeft size={20}/></button>
                    <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><ChevronRight size={20}/></button>
                </div>
            </div>

            <AnimatePresence>
                {isDetailsModalOpen && selectedCustomer && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModals} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
                                <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-16 h-16 rounded-full"/>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">{selectedCustomer.name} {selectedCustomer.totalSpend > 500 && <Star className="w-5 h-5 ml-2 text-yellow-400 fill-current"/>}</h2>
                                    <p className="text-gray-500">Member since {selectedCustomer.joinDate}</p>
                                </div>
                                <button onClick={closeModals} className="p-1 text-gray-500 hover:text-gray-800 ml-auto"><X size={24} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Total Spend</p><p className="font-bold text-xl text-green-600">${selectedCustomer.totalSpend.toFixed(2)}</p></div>
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Total Orders</p><p className="font-bold text-xl text-gray-800">{selectedCustomer.totalOrders}</p></div>
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Avg. Order Value</p><p className="font-bold text-xl text-gray-800">${(selectedCustomer.totalSpend / selectedCustomer.totalOrders).toFixed(2)}</p></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Recent Order History</h3>
                                <div className="border rounded-lg">
                                    {selectedCustomer.recentOrders.map((order, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
                                            <div><p className="font-medium text-pink-600">{order.id}</p><p className="text-sm text-gray-500">{order.date}</p></div>
                                            <div><p className="font-semibold text-gray-800">${order.total.toFixed(2)}</p><p className={`text-xs text-right ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {isAddModalOpen && (
                     <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModals} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Add New Customer</h2><button onClick={closeModals} className="p-1"><X size={24} /></button></div>
                            <form className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Jane Doe" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., jane.d@example.com" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label><input type="tel" className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={closeModals} className="px-6 py-2 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-lg">Save Customer</button></div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}