import { useState } from 'react';
import { BarChart3, Wallet, ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from 'framer-motion';
import { useGetAnalyticsSummaryQuery } from '../../api/analyticApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


export default function Analytic() {
    const [timeFilter, setTimeFilter] = useState('today');
    const { data: analyticsData, isLoading, error } = useGetAnalyticsSummaryQuery({ filter: timeFilter });

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading analytics.</div>;
    }

    const {
        totalRevenue = 0,
        totalOrders = 0,
        totalProducts = 0,
        lowStockCount = 0,
        orderStatus = [],
        bestSellingProducts = [],
        lowStockProducts = [],
        recentOrders = [],
        salesOverview = []
    } = analyticsData?.data || analyticsData || {};

    const kpiData = [
        { title: "Total Revenue", value: `$${Number(totalRevenue).toFixed(2)}`, color: "text-emerald-600", bgColor: "bg-emerald-50" },
        { title: "Total Orders", value: totalOrders.toString(), color: "text-blue-600", bgColor: "bg-blue-50" },
        { title: "Products", value: totalProducts.toString(), color: "text-purple-600", bgColor: "bg-purple-50" },
        { title: "Low Stock", value: lowStockCount.toString(), color: "text-red-600", bgColor: "bg-red-50" },
    ];

    const getIconForTitle = (title) => {
        if (title.toLowerCase().includes('revenue')) return Wallet;
        if (title.toLowerCase().includes('order')) return ShoppingCart;
        if (title.toLowerCase().includes('product')) return Package;
        if (title.toLowerCase().includes('stock')) return AlertTriangle;
        return BarChart3;
    };

    return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Shop Analytics</h2>
                <p className="text-gray-500 mt-1">Deep dive into your sales and product data.</p>
            </div>
            
            {/* Filter */}
            <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
                {[
                    { label: 'Today', value: 'today' },
                    { label: 'This Week', value: 'week' },
                    { label: 'This Month', value: 'month' },
                    { label: 'This Year', value: 'year' }
                ].map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setTimeFilter(filter.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            timeFilter === filter.value 
                                ? 'bg-pink-50 text-pink-600' 
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => {
                const IconComponent = getIconForTitle(kpi.title);
                return (
                    <motion.div key={index} variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-gray-500 font-medium">{kpi.title}</h3>
                            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                                <IconComponent className={kpi.color} size={20}/>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-4">{kpi.value}</p>
                    </motion.div>
                );
            })}
        </div>
        
        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Overview Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h3>
                 <div className="flex-1 min-h-[320px] w-full">
                    {salesOverview && salesOverview.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} tickFormatter={(value) => `$${value}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    formatter={(value, name) => [name === 'revenue' ? `$${Number(value).toFixed(2)}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#f472b6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                            <TrendingUp className="text-gray-400 mb-3" size={48} />
                            <p className="text-gray-500 font-medium">No sales data available for this period.</p>
                        </div>
                    )}
                 </div>
            </motion.div>

            {/* Order Status Doughnut Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h3>
                <div className="flex flex-col items-center justify-center h-80">
                    {/* Doughnut Chart */}
                    <div className="relative w-full h-48">
                         {orderStatus && orderStatus.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {orderStatus.map((entry, index) => {
                                            const hexColor = 
                                                entry.name === 'Pending' ? '#f59e0b' :
                                                entry.name === 'Confirmed' || entry.name === 'Confirm' ? '#0ea5e9' :
                                                entry.name === 'Processing' ? '#3b82f6' :
                                                entry.name === 'Shipped' ? '#6366f1' :
                                                entry.name === 'Delivered' ? '#22c55e' : 
                                                entry.name === 'Cancelled' || entry.name === 'Cancel' || entry.name === 'Canceled' ? '#ef4444' : '#6b7280';
                                            return <Cell key={`cell-${index}`} fill={hexColor} />;
                                        })}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `${value}%`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                         ) : (
                             <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                 No order data available
                             </div>
                         )}
                    </div>
                    <div className="mt-6 w-full space-y-2">
                        {orderStatus.map(status => {
                            const colorClass = status.color || (
                                status.name === 'Pending' ? 'bg-amber-500' :
                                status.name === 'Confirmed' || status.name === 'Confirm' ? 'bg-sky-500' :
                                status.name === 'Processing' ? 'bg-blue-500' :
                                status.name === 'Shipped' ? 'bg-indigo-500' :
                                status.name === 'Delivered' ? 'bg-green-500' : 
                                status.name === 'Cancelled' || status.name === 'Cancel' || status.name === 'Canceled' ? 'bg-red-500' : 'bg-gray-500'
                            );
                            return (
                                <div key={status.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
                                        <span className="text-gray-600">{status.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{status.value}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Products and Low Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Best-Selling Products List */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Best-Selling Products</h3>
                <div className="space-y-4">
                    {bestSellingProducts && bestSellingProducts.length > 0 ? (
                        bestSellingProducts.map((product, index) => (
                            <div key={product.productId || index} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl font-bold text-gray-400 mr-2">{index + 1}.</span>
                                    {product.imageUrl && (
                                        <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `/uploads/${product.imageUrl}`} alt={product.productName} className="w-10 h-10 rounded object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/uploads/not-found.avif'; }} />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-700">{product.productName}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            <span className="font-bold text-gray-800">{product.totalSold}</span> units sold
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm py-4 text-center">No best-selling products found.</div>
                    )}
                </div>
            </motion.div>

            {/* Low Stock Products List */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Products</h3>
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {lowStockProducts && lowStockProducts.length > 0 ? (
                        lowStockProducts.map((product, index) => (
                            <div key={product.productId || index} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    {product.imageUrl && (
                                        <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `/uploads/${product.imageUrl}`} alt={product.productName} className="w-8 h-8 rounded object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/uploads/not-found.avif'; }} />
                                    )}
                                    <p className="font-medium text-gray-700">{product.productName}</p>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-red-500">{product.stock} in stock</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm py-4 text-center">No low stock products.</div>
                    )}
                </div>
            </motion.div>
        </div>

        {/* Recent Orders List */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                            <th className="pb-3 font-medium">Order ID</th>
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order, index) => (
                                <tr key={order.orderId || index} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3 font-medium text-gray-800">#ORD-{order.orderId}</td>
                                    <td className="py-3 text-gray-600">{order.customerName}</td>
                                    <td className="py-3 text-gray-500 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="py-3 font-semibold text-gray-700">${Number(order.totalPrice).toFixed(2)}</td>
                                    <td className="py-3">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${
                                            order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' :
                                            order.status === 'SHIPPED' ? 'bg-indigo-50 text-indigo-600' :
                                            order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {order.status?.toLowerCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-gray-500 text-sm">No recent orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    </motion.div>
    )
}