import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, X } from 'lucide-react';

// --- MOCK DATA (Replace with real data from your API) ---
const initialCategories = [
    { id: 1, name: 'Celebration Cakes', productCount: 15, dateCreated: '2025-08-12' },
    { id: 2, name: 'Flower Bouquets', productCount: 22, dateCreated: '2025-08-10' },
    { id: 3, name: 'Cupcakes & Pastries', productCount: 18, dateCreated: '2025-08-05' },
    { id: 4, name: 'Seasonal Specials', productCount: 8, dateCreated: '2025-09-01' },
    { id: 5, name: 'Gift Add-ons', productCount: 31, dateCreated: '2025-07-20' },
];

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalPanelVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
};


export default function Category() {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null); // Used for editing
    const [categoryName, setCategoryName] = useState('');

    const openModal = (category = null) => {
        setCurrentCategory(category);
        setCategoryName(category ? category.name : '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setCategoryName('');
    };

    const handleSave = () => {
        if (!categoryName.trim()) return; // Prevent empty category names

        if (currentCategory) {
            // Edit existing category
            setCategories(categories.map(cat => 
                cat.id === currentCategory.id ? { ...cat, name: categoryName } : cat
            ));
        } else {
            // Add new category
            const newCategory = {
                id: Date.now(), // simple unique ID
                name: categoryName,
                productCount: 0,
                dateCreated: new Date().toISOString().slice(0, 10),
            };
            setCategories([newCategory, ...categories]);
        }
        closeModal();
    };
    
    const handleDelete = (id) => {
        // Add a confirmation before deleting in a real app
        setCategories(categories.filter(cat => cat.id !== id));
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Category
                </motion.button>
            </div>

            {/* Categories Table */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500">Category Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Products</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Date Created</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                                    <td className="p-4 text-gray-600">{cat.productCount}</td>
                                    <td className="p-4 text-gray-600">{cat.dateCreated}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        variants={modalBackdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            variants={modalPanelVariants}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {currentCategory ? 'Edit Category' : 'Add New Category'}
                                </h2>
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g., Wedding Cakes"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button onClick={closeModal} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-6 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600">
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}