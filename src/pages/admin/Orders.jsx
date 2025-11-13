import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- MOCK DATA (Replace with real data from your API) ---
// Using today's date context (Sep 19, 2025) for relevance
const initialOrders = [
    { id: '#1536', date: '2025-09-19', customer: { name: 'Olivia Chen', email: 'olivia.c@example.com', address: '123 Maple St, Springville' }, total: 45.00, paymentStatus: 'Paid', status: 'Processing', items: [{ name: 'Chocolate Truffle Cake', qty: 1, price: 45.00 }] },
    { id: '#1535', date: '2025-09-19', customer: { name: 'Liam Rodriguez', email: 'liam.r@example.com', address: '456 Oak Ave, Rivertown' }, total: 80.00, paymentStatus: 'Paid', status: 'Delivered', items: [{ name: 'Anniversary Bouquet', qty: 1, price: 80.00 }] },
    { id: '#1534', date: '2025-09-18', customer: { name: 'Sophia Nguyen', email: 'sophia.n@example.com', address: '789 Pine Ln, Meadowbrook' }, total: 25.00, paymentStatus: 'Paid', status: 'Delivered', items: [{ name: 'Cupcake Assortment', qty: 1, price: 25.00 }] },
    { id: '#1533', date: '2025-09-18', customer: { name: 'Noah Patel', email: 'noah.p@example.com', address: '101 Birch Rd, Hillcrest' }, total: 120.00, paymentStatus: 'Pending', status: 'Shipped', items: [{ name: 'Custom Birthday Cake', qty: 1, price: 120.00 }] },
    { id: '#1532', date: '2025-09-17', customer: { name: 'Ava Kim', email: 'ava.k@example.com', address: '212 Cedar Blvd, Lakeside' }, total: 15.00, paymentStatus: 'Refunded', status: 'Cancelled', items: [{ name: 'Single Red Rose', qty: 1, price: 15.00 }] },
    { id: '#1531', date: '2025-09-16', customer: { name: 'Jameson Lee', email: 'jameson.l@example.com', address: '333 Elm Ct, Sunnyside' }, total: 72.50, paymentStatus: 'Paid', status: 'Pending', items: [{ name: 'Dozen Roses', qty: 1, price: 55.00 }, { name: 'Greeting Card', qty: 1, price: 2.50 }, { name: 'Chocolates', qty: 1, price: 15.00 }] },
];

const ORDERS_PER_PAGE = 5;

// --- Animation Variants ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };


export default function Orders() {
    const [orders, setOrders] = useState(initialOrders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Filters & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filtering Logic
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(order => statusFilter === 'All' || order.status === statusFilter);
    }, [orders, searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    // Handlers
    const handleViewDetails = (order) => { setSelectedOrder(order); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    };

    // Helper to get status chip color
    const getStatusChipClass = (status) => {
        const statusClasses = {
            'Delivered': 'bg-green-100 text-green-700', 'Processing': 'bg-blue-100 text-blue-700', 'Shipped': 'bg-indigo-100 text-indigo-700',
            'Pending': 'bg-yellow-100 text-yellow-700', 'Cancelled': 'bg-red-100 text-red-700'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search Order ID or Customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="All">All Statuses</option>
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                {['Order ID', 'Date', 'Customer', 'Total', 'Payment', 'Status', 'Actions'].map(h => <th key={h} className="p-4 text-sm font-semibold text-gray-500">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-pink-600">{order.id}</td>
                                    <td className="p-4 text-gray-600">{order.date}</td>
                                    <td className="p-4 font-medium text-gray-800">{order.customer.name}</td>
                                    <td className="p-4 text-gray-800 font-medium">${order.total.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">{order.paymentStatus}</td>
                                    <td className="p-4">
                                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`text-xs font-semibold rounded-full px-2 py-1 border-2 focus:outline-none ${getStatusChipClass(order.status)} ${getStatusChipClass(order.status).replace('bg-', 'border-').replace('-100', '-200')}`}>
                                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleViewDetails(order)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Showing {paginatedOrders.length} of {filteredOrders.length} orders</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><ChevronLeft size={20}/></button>
                    <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><ChevronRight size={20}/></button>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModal} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">Order Details: <span className="text-pink-600">{selectedOrder.id}</span></h2>
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
                                    <p className="text-gray-600">{selectedOrder.customer.name}</p>
                                    <p className="text-gray-600">{selectedOrder.customer.email}</p>
                                    <p className="text-gray-600 mt-2">{selectedOrder.customer.address}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                                    <p className="text-gray-600">Date: {selectedOrder.date}</p>
                                    <p className="text-gray-600">Total: <span className="font-bold text-gray-800">${selectedOrder.total.toFixed(2)}</span></p>
                                    <div className="mt-2 inline-block"><span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-2">Items Ordered</h3>
                                <div className="border rounded-lg">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                            <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}