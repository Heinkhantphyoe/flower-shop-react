import { BarChart3, Wallet, Users, Repeat, Goal } from "lucide-react";
import { motion } from 'framer-motion';

// --- MOCK DATA (Replace with real data from your API) ---

const kpiData = [
    { title: "Average Order Value", value: "$52.50", change: "+3.2%", isPositive: true, icon: Wallet },
    { title: "Repeat Customer Rate", value: "18.4%", change: "+1.5%", isPositive: true, icon: Repeat },
    { title: "Conversion Rate", value: "4.8%", change: "-0.5%", isPositive: false, icon: Goal },
    { title: "New Customers", value: "42", change: "+12", isPositive: true, icon: Users },
];

const categorySales = [
    { name: "Cakes", value: 45, color: "bg-pink-500" },
    { name: "Flower Bouquets", value: 35, color: "bg-rose-500" },
    { name: "Cupcakes & Pastries", value: 15, color: "bg-amber-500" },
    { name: "Add-ons", value: 5, color: "bg-teal-500" },
];

const topProducts = [
    { name: "Red Velvet Cake", sales: 124 },
    { name: "Dozen Red Roses", sales: 98 },
    { name: "Anniversary Combo", sales: 76 },
    { name: "Chocolate Truffle Box", sales: 62 },
];

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
    return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
        {/* Header */}
        <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-800">Shop Analytics</h2>
            <p className="text-gray-500 mt-1">Deep dive into your sales and customer data.</p>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
                <motion.div key={index} variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <h3 className="text-gray-500 font-medium">{kpi.title}</h3>
                        <kpi.icon className="text-gray-400" size={20}/>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-4">{kpi.value}</p>
                    <p className={`text-sm mt-1 font-semibold ${kpi.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.change} vs last month
                    </p>
                </motion.div>
            ))}
        </div>
        
        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Performance Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance (Last 30 Days)</h3>
                 <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <BarChart3 className="text-pink-400 mx-auto mb-3" size={48} />
                        <p className="text-gray-500 font-medium">
                            {/* A library like Recharts or Chart.js would be integrated here */}
                            Sales line chart will be displayed here.
                        </p>
                    </div>
                 </div>
            </motion.div>

            {/* Sales by Category Doughnut Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales by Category</h3>
                <div className="flex flex-col items-center justify-center h-80">
                    {/* Doughnut Chart Placeholder */}
                    <div className="relative w-40 h-40">
                         <div className="absolute inset-0 bg-pink-500 rounded-full" style={{clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)"}}></div>
                         <div className="absolute inset-0 bg-rose-500 rounded-full" style={{clipPath: "polygon(0% 100%, 50% 100%, 50% 50%)"}}></div>
                         <div className="absolute inset-0 bg-amber-500 rounded-full" style={{clipPath: "polygon(0 55%, 0% 100%, 50% 100%, 50% 50%)"}}></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-6 w-full space-y-2">
                        {categorySales.map(cat => (
                            <div key={cat.name} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-2 ${cat.color}`}></span>
                                    <span className="text-gray-600">{cat.name}</span>
                                </div>
                                <span className="font-semibold text-gray-800">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Top Products List */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
                {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <p className="font-medium text-gray-700">{index + 1}. {product.name}</p>
                        <p className="font-semibold text-gray-800 bg-pink-50 px-3 py-1 rounded-md">{product.sales} units sold</p>
                    </div>
                ))}
            </div>
        </motion.div>
    </motion.div>
    )
}