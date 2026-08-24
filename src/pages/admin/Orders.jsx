import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ChevronLeft, ChevronRight, Ticket, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../api/orderApi';
import { useGetCouponsQuery, useAddCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../../api/couponApi';
import { toast } from 'react-toastify';

const ORDERS_PER_PAGE = 5;

// --- Animation Variants ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };

// Fixed-amount discount coupons, managed here instead of a separate page/route
function CouponsPanel() {
    const [open, setOpen] = useState(false);
    const { data: couponsData, isLoading } = useGetCouponsQuery(undefined, { skip: !open });
    const coupons = Array.isArray(couponsData?.data) ? couponsData.data : [];
    const [addCoupon] = useAddCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const [form, setForm] = useState({ code: '', amount: '', expiresAt: '' });

    const handleInputChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAdd = async () => {
        if (!form.code.trim() || !form.amount) {
            toast.error('Coupon code and amount are required');
            return;
        }
        try {
            // datetime-local gives "YYYY-MM-DDTHH:mm"; backend LocalDateTime needs seconds appended
            await addCoupon({
                code: form.code.trim(),
                amount: Number(form.amount),
                ...(form.expiresAt && { expiresAt: `${form.expiresAt}:00` }),
            }).unwrap();
            toast.success('Coupon created successfully!');
            setForm({ code: '', amount: '', expiresAt: '' });
        } catch (err) {
            console.error('Failed to create coupon:', err);
            toast.error(err?.data?.message || 'Failed to create coupon');
        }
    };

    const toggleActive = async (coupon) => {
        try {
            await updateCoupon({ id: coupon.id, active: !coupon.active }).unwrap();
            toast.success(`Coupon ${coupon.active ? 'deactivated' : 'activated'}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update coupon');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCoupon(id).unwrap();
            toast.success('Coupon deleted');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete coupon');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                    <Ticket size={20} className="text-pink-500" />
                    Discount Coupons
                    <span className="text-xs font-normal text-gray-500">(fixed amount off the order subtotal)</span>
                </span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {open && (
                <div className="p-4 pt-0 space-y-4">
                    {/* Add Coupon */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input type="text" name="code" placeholder="CODE e.g. SAVE5" value={form.code} onChange={handleInputChange} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 uppercase" />
                        <input type="number" name="amount" step="0.01" min="0" placeholder="Amount ($)" value={form.amount} onChange={handleInputChange} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                        <input type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={handleInputChange} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-600" />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAdd} className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors whitespace-nowrap">
                            <PlusCircle size={18} />
                            Add
                        </motion.button>
                    </div>

                    {/* Coupons Table */}
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading coupons...</div>
                    ) : coupons.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No coupons yet</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    {['Code', 'Amount', 'Status', 'Expires At', 'Used', 'Actions'].map(h => <th key={h} className="p-3 text-sm font-semibold text-gray-500">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-3 font-mono font-semibold text-pink-600">{c.code}</td>
                                        <td className="p-3 text-gray-800">${Number(c.amount).toFixed(2)}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {c.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleString() : 'No expiry'}</td>
                                        <td className="p-3 text-gray-600">{c.usedCount}</td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => toggleActive(c)} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                                                    {c.active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}


export default function Orders() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Filters & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Fetch orders from API using RTK Query
    const queryStatusMap = {
        'PENDING': 0,
        'CONFIRMED': 1,
        'DELIVERED': 2,
        'CANCELLED': 3
    };
    
    const { data: ordersData, isLoading, isError, error } = useGetOrdersQuery({
        page: currentPage - 1,
        limit: ORDERS_PER_PAGE,
        ...(statusFilter !== 'All' && { orderStatus: queryStatusMap[statusFilter] }),
        ...(searchTerm && { search: searchTerm }),
    });
    
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    
    const orders = ordersData?.data?.items || [];
    const totalOrders = ordersData?.data?.totalItems || 0;
    const totalPages = ordersData?.data?.totalPages || 1;

    // Handlers
    const handleViewDetails = (order) => { setSelectedOrder(order); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const statusMap = {
                'PENDING': 0,
                'CONFIRMED': 1,
                'DELIVERED': 2,
                'CANCELLED': 3
            };
            const orderStatus = statusMap[newStatus];
            await updateOrderStatus({ orderId, orderStatus }).unwrap();
            toast.success('Order status updated successfully');
        } catch (err) {
            console.error('Error updating order status:', err);
            toast.error(err?.data?.message || 'Failed to update order status');
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Helper to get status chip color
    const getStatusChipClass = (status) => {
        const statusClasses = {
            'DELIVERED': 'bg-green-100 text-green-700', 
            'CONFIRMED': 'bg-blue-100 text-blue-700', 
            'PENDING': 'bg-yellow-100 text-yellow-700', 
            'CANCELLED': 'bg-red-100 text-red-700'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-700';
    };

    // Helper to capitalize status
    const formatStatus = (status) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>

            {/* Discount Coupons */}
            <CouponsPanel />

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search Order ID or Customer ID" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="All">All Statuses</option>
                    {['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-600">Loading orders...</div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-600">{error?.data?.message || 'Failed to load orders'}</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">No orders found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    {['Order ID', 'Date', 'Address', 'Total', 'Items', 'Status', 'Actions'].map(h => <th key={h} className="p-4 text-sm font-semibold text-gray-500">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-pink-600">#{order.id}</td>
                                        <td className="p-4 text-gray-600">{formatDate(order.orderDate)}</td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate" title={order.orderAddress}>{order.orderAddress}</td>
                                        <td className="p-4 text-gray-800 font-medium">${order.items?.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0).toFixed(2) || '0.00'}</td>
                                        <td className="p-4 text-gray-600">{order.items.length} item(s)</td>
                                        <td className="p-4">
                                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`text-xs font-semibold rounded-full px-2 py-1 border-2 focus:outline-none ${getStatusChipClass(order.status)} ${getStatusChipClass(order.status).replace('bg-', 'border-').replace('-100', '-200')}`}>
                                                {['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
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
                )}
            </div>

            {/* Pagination */}
            {!isLoading && !isError && orders.length > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Showing {orders.length} of {totalOrders} orders</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><ChevronLeft size={20}/></button>
                        <span className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><ChevronRight size={20}/></button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModal} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">Order Details: <span className="text-pink-600">#{selectedOrder.id}</span></h2>
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                                    <p className="text-gray-600">{selectedOrder.orderAddress}</p>
                                    <p className="text-gray-600 mt-4"><span className="font-semibold">User ID:</span> {selectedOrder.userId}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                                    <p className="text-gray-600">Date: {formatDate(selectedOrder.orderDate)}</p>
                                    <p className="text-gray-600">Total: <span className="font-bold text-gray-800">${selectedOrder.items?.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0).toFixed(2) || '0.00'}</span></p>
                                    <div className="mt-2 inline-block"><span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(selectedOrder.status)}`}>{formatStatus(selectedOrder.status)}</span></div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Items Ordered</h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0 shadow-sm">
                                                <img 
                                                    src={item.productImageUrl ? `/uploads/${item.productImageUrl}` : '/uploads/not-found.avif'} 
                                                    alt={item.productName || `Product ${item.productId}`} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = '/uploads/not-found.avif'; }}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800 line-clamp-1">{item.productName || `Product ID: ${item.productId}`}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Qty: {item.quantity} <span className="mx-1 text-gray-300">|</span> <span className="font-medium text-pink-600">${item.price?.toFixed(2) || '0.00'}</span> each
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">${(item.quantity * (item.price || 0)).toFixed(2)}</p>
                                            </div>
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