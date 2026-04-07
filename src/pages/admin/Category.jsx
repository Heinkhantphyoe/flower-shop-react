import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
    useGetCategoriesListQuery, 
    useAddCategoryMutation, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation 
} from '../../api/categoryApi';
import Loading from '../../components/Loading';

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
    const { data: categoryResponse, isLoading, isError, refetch } = useGetCategoriesListQuery(0);
    const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    // Data from API
    const categories = categoryResponse?.data?.items || [];

    // Add/Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

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

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            if (currentCategory) {
                // Edit existing category
                await updateCategory({ id: currentCategory.id, name: categoryName }).unwrap();
                toast.success('Category updated successfully');
            } else {
                // Add new category
                await addCategory({ name: categoryName }).unwrap();
                toast.success('Category added successfully');
            }
            closeModal();
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };
    
    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        
        try {
            await deleteCategory(categoryToDelete.id).unwrap();
            toast.success('Category deleted successfully');
            closeDeleteModal();
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete category');
        }
    };

    if (isLoading) return <Loading />;
    if (isError) return <div className="text-red-500 p-8 text-center text-xl font-medium">Failed to load categories. Please try again.</div>;

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
                    <table className="w-full text-left bg-white">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500">ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Category Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Products count</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Last Updated</th>
                                <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">{cat.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {cat.productCount} Items
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(cat.updatedAt || cat.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => openModal(cat)} 
                                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(cat)} 
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">
                                        No categories found. Add a new one to get started!
                                    </td>
                                </tr>
                            )}
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
                        className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center backdrop-blur-sm"
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
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
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
                                <button 
                                    onClick={closeModal} 
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    disabled={isAdding || isUpdating}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={isAdding || isUpdating}
                                    className="px-6 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isAdding || isUpdating ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        variants={modalBackdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={closeDeleteModal}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 drop-shadow-xl backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalPanelVariants}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                                    <AlertCircle size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Category?</h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong className="text-gray-900">{categoryToDelete?.name}</strong>? This action cannot be undone.
                                </p>
                                
                                <div className="flex w-full space-x-3 gap-2">
                                    <button 
                                        onClick={closeDeleteModal}
                                        className="flex-1 py-2.5 px-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-2.5 px-4 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}