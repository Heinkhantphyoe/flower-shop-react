import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, X, Search, ImagePlus } from 'lucide-react';

// --- MOCK DATA (Replace with real data from your API) ---
const categories = [
    { id: 1, name: 'Celebration Cakes' },
    { id: 2, name: 'Flower Bouquets' },
    { id: 3, name: 'Cupcakes & Pastries' },
    { id: 4, name: 'Seasonal Specials' },
    { id: 5, name: 'Gift Add-ons' },
];

const initialProducts = [
    { id: 1, name: 'Classic Red Velvet Cake', image: 'https://via.placeholder.com/150/F87171/FFFFFF?text=Cake', sku: 'CK-RV-01', category: 'Celebration Cakes', price: 45.00, stock: 12, status: 'Active' },
    { id: 2, name: 'Dozen Romantic Roses', image: 'https://via.placeholder.com/150/F472B6/FFFFFF?text=Roses', sku: 'FL-RR-12', category: 'Flower Bouquets', price: 55.00, stock: 8, status: 'Active' },
    { id: 3, name: 'Chocolate Fudge Cupcakes (6)', image: 'https://via.placeholder.com/150/78350F/FFFFFF?text=Cupcake', sku: 'CP-CF-06', category: 'Cupcakes & Pastries', price: 22.50, stock: 35, status: 'Active' },
    { id: 4, name: 'Orchid Plant', image: 'https://via.placeholder.com/150/C084FC/FFFFFF?text=Orchid', sku: 'FL-OP-01', category: 'Flower Bouquets', price: 38.00, stock: 5, status: 'Low Stock' },
    { id: 5, name: 'Autumn Festival Bouquet', image: 'https://via.placeholder.com/150/F97316/FFFFFF?text=Bouquet', sku: 'FL-SF-01', category: 'Seasonal Specials', price: 65.00, stock: 0, status: 'Out of Stock' },
    { id: 6, name: 'Premium Gift Box', image: 'https://via.placeholder.com/150/10B981/FFFFFF?text=Gift', sku: 'GA-GB-01', category: 'Gift Add-ons', price: 15.00, stock: 50, status: 'Archived' },
];

// --- Animation Variants (Consistent with other pages) ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };

export default function Product() {
    const [products, setProducts] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');

    const openModal = (product = null) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
            .filter(p => {
                if (stockFilter === 'All') return true;
                if (stockFilter === 'In Stock') return p.stock > 10;
                if (stockFilter === 'Low Stock') return p.stock > 0 && p.stock <= 10;
                if (stockFilter === 'Out of Stock') return p.stock === 0;
                return true;
            });
    }, [products, searchTerm, categoryFilter, stockFilter]);

    // Helper to get status chip color
    const getStatusChipClass = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Low Stock': return 'bg-yellow-100 text-yellow-700';
            case 'Out of Stock': return 'bg-red-100 text-red-700';
            case 'Archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header and Add Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal()} className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Product
                </motion.button>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by product name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="All">All Stock</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500">Product</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">SKU</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Category</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Price</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Stock</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">
                                        <div className="flex items-center space-x-3">
                                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover"/>
                                            <span>{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{p.sku}</td>
                                    <td className="p-4 text-gray-600">{p.category}</td>
                                    <td className="p-4 text-gray-800 font-medium">${p.price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            {p.stock <= 10 && p.stock > 0 && <span className="h-2 w-2 rounded-full bg-yellow-500"></span>}
                                            {p.stock === 0 && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                                            <span>{p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(p.status)}`}>{p.status}</span></td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openModal(p)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Add/Edit Modal (Placeholder Form) */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModal} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            
                            {/* In a real app, this would be a form with state management (e.g., React Hook Form) */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Placeholder for form fields */}
                                    <p className="md:col-span-2 text-gray-600">This is a placeholder for the product form. You would add inputs for Name, SKU, Price, Stock, Description, and an Image Uploader here.</p>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                                        <ImagePlus className="mx-auto" size={40}/>
                                        <span>Upload Product Image</span>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Product Name" defaultValue={currentProduct?.name} className="w-full p-2 border rounded-md" />
                                        <select defaultValue={currentProduct?.category} className="w-full p-2 border rounded-md"><option>Select Category</option>{categories.map(c=><option key={c.id}>{c.name}</option>)}</select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button onClick={closeModal} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button onClick={closeModal} className="px-6 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600">Save Product</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}