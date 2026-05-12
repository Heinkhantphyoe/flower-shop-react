import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useGetCustomersQuery } from '../../api/analyticApi';

const CUSTOMERS_PER_PAGE = 5;

// --- Animation Variants ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };

export default function Customers() {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: response, isLoading } = useGetCustomersQuery({
        keyword: appliedSearchTerm,
        page: currentPage - 1, // Spring Boot pagination defaults to 0-indexed
        size: CUSTOMERS_PER_PAGE
    });

    const customerData = response?.data;
    const customers = customerData?.items || [];
        
    const totalPages = customerData?.totalPages || 1;
    const totalItems = customerData?.totalItems || customers.length;

    const handleViewDetails = (customer) => { setSelectedCustomer(customer); setIsDetailsModalOpen(true); };
    const closeModals = () => { setIsDetailsModalOpen(false); };

    // Handler for search button to reset page
    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" 
                    />
                </div>
                <button 
                    onClick={handleSearch}
                    disabled={!searchTerm.trim()}
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800">
                    Search
                </button>
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
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Loading customers...</td></tr>
                            ) : customers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">No customers found.</td></tr>
                            ) : customers.map((c) => {
                                const avatar = c.profileImageUrl ? `/uploads/${c.profileImageUrl}` : `https://ui-avatars.com/api/?name=${c.email || 'U'}`;
                                const name = c.name || 'Unknown User';
                                return (
                                    <tr key={c.customerId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">
                                            <div className="flex items-center space-x-3">
                                                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover"/>
                                                <div>
                                                    <p>{name}</p>
                                                    <p className="text-xs text-gray-500">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{new Date(c.registeredAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{c.recentOrders?.length > 0 ? new Date(c.recentOrders[0].date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-4 text-gray-800 font-medium">{c.totalOrders}</td>
                                        <td className="p-4 text-green-600 font-bold">${(c.totalSpent || 0).toFixed(2)}</td>
                                        <td className="p-4">
                                            <button onClick={() => handleViewDetails({...c, name, avatar})} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"><Eye size={18} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Showing {customers.length} of {totalItems} customers</span>
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
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">{selectedCustomer.name} {selectedCustomer.totalSpent > 500 && <Star className="w-5 h-5 ml-2 text-yellow-400 fill-current"/>}</h2>
                                    <p className="text-gray-500">Member since {new Date(selectedCustomer.registeredAt).toLocaleDateString()}</p>
                                </div>
                                <button onClick={closeModals} className="p-1 text-gray-500 hover:text-gray-800 ml-auto"><X size={24} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Total Spend</p><p className="font-bold text-xl text-green-600">${(selectedCustomer.totalSpent || 0).toFixed(2)}</p></div>
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Total Orders</p><p className="font-bold text-xl text-gray-800">{selectedCustomer.totalOrders}</p></div>
                                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">Avg. Order Value</p><p className="font-bold text-xl text-gray-800">${selectedCustomer.totalOrders > 0 ? ((selectedCustomer.totalSpent || 0) / selectedCustomer.totalOrders).toFixed(2) : '0.00'}</p></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Recent Order History</h3>
                                <div className="border rounded-lg">
                                    {(selectedCustomer.recentOrders || []).length > 0 ? selectedCustomer.recentOrders.map((order, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
                                            <div><p className="font-medium text-pink-600">{order.id || `#${index+1}`}</p><p className="text-sm text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p></div>
                                            <div><p className="font-semibold text-gray-800">${(order.total || 0).toFixed(2)}</p><p className={`text-xs text-right ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status || 'Completed'}</p></div>
                                        </div>
                                    )) : <div className="p-3 text-sm text-gray-500 text-center">No recent orders found.</div>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}