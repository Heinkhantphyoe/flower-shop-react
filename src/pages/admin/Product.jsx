import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, X, Search, ImagePlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetProductsQuery, useGetCategoriesQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../api/productApi';
import Pagination from '../../components/Pagination';

// --- Animation Variants (Consistent with other pages) ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const modalBackdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalPanelVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } } };

export default function Product() {
    const [page, setPage] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState('');
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const { data: productsData, isLoading, isError } = useGetProductsQuery({ page, categoryId: categoryFilter, stockFilterId: stockFilter });
    const products = productsData?.data?.items || [];
    const totalPages = productsData?.data?.totalPages || 0;

    const { data: categoriesData } = useGetCategoriesQuery();
    // Safely extract the categories array regardless of API response shape
    const extractedCategories = categoriesData?.data?.items || categoriesData?.data || categoriesData || [];
    const categories = Array.isArray(extractedCategories) ? extractedCategories : [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const openModal = (product = null) => {
        setCurrentProduct(product);
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                categoryId: product.categoryId || '',
                image: null
            });
            setPreviewUrl(product.imageUrl ? `/uploads/${product.imageUrl}` : null);
        } else {
            setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', image: null });
            setPreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            data.append('categoryId', formData.categoryId);
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (currentProduct) {
                await updateProduct({ id: currentProduct.id, data }).unwrap();
                toast.success('Product updated successfully!');
            } else {
                await addProduct(data).unwrap();
                toast.success('Product added successfully!');
            }
            closeModal();
            setPage(0); // Reset page to see newly added item
        } catch (err) {
            console.error('Failed to save product:', err);
            toast.error(err?.data?.message || 'Failed to save product. Please try again.');
        }
    };

    const handleDelete = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete).unwrap();
            toast.success('Product deleted successfully!');
            
            // If deleting the last item on a page, fetch previous
            if (filteredProducts.length === 1 && page > 0) {
                setPage(prev => prev - 1);
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
            toast.error(err?.data?.message || 'Failed to delete product. Please try again.');
        } finally {
            closeDeleteModal();
        }
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const isFiltering = searchTerm !== '';
    const displayTotalPages = isFiltering ? Math.ceil(filteredProducts.length / 10) : totalPages;

    // Helper to get status chip color
    const getStatusChipClass = (stock) => {
        if (stock === 0) return 'bg-red-100 text-red-700';
        if (stock <= 10) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStatusText = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'Active';
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
                <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(0); }} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <select value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(0); }} className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="">All Stock</option>
                    <option value="1">In Stock</option>
                    <option value="2">Low Stock</option>
                    <option value="3">Out of Stock</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading products...</div>
                    ) : isError ? (
                        <div className="p-8 text-center text-red-500">Error loading products.</div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-500">Product</th>
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
                                            <img src={`/uploads/${p.imageUrl}`} alt={p.name} className="w-10 h-10 rounded-md object-cover" onError={(e) => { e.target.src = '/uploads/not-found.avif' }} />
                                            <span>{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{p.categoryName}</td>
                                    <td className="p-4 text-gray-800 font-medium">${p.price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            {p.stock <= 10 && p.stock > 0 && <span className="h-2 w-2 rounded-full bg-yellow-500"></span>}
                                            {p.stock === 0 && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                                            <span>{p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(p.stock)}`}>{getStatusText(p.stock)}</span></td>
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
                    )}
                </div>
            </div>
            
            {/* Pagination */}
            {!isLoading && !isError && displayTotalPages > 1 && (
                <div className="pb-6">
                    <Pagination 
                        currentPage={page + 1} 
                        totalPages={displayTotalPages} 
                        onPageChange={(newPage) => setPage(newPage - 1)} 
                    />
                </div>
            )}
            
            {/* Add/Edit Modal (Placeholder Form) */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeModal} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            
                            {/* Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-32 object-cover rounded-md" />
                                            ) : (
                                                <>
                                                    <ImagePlus className="mx-auto mb-2" size={40}/>
                                                    <span>Upload Product Image</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                                        <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
                                            <option value="">Select Category</option>
                                            {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                                        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                                    </div>
                                    <div className="space-y-4">
                                        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md h-full min-h-[120px]" required></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button onClick={closeModal} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button onClick={handleSubmit} disabled={isAdding || isUpdating} className="px-6 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600 disabled:opacity-50">
                                    {isAdding || isUpdating ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={closeDeleteModal} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalPanelVariants} onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                                <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this product? This action cannot be undone.</p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-6">
                                <button onClick={closeDeleteModal} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition-colors">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}