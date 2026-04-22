import React, { useState } from "react";
import { Trash2, ShoppingCart, Heart, Package, Loader2, X, AlertTriangle } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetWishlistsQuery, 
  useRemoveFromWishlistMutation, 
  useMoveToCartMutation,
  useClearWishlistMutation
} from "../../api/wishlistApi";
import { toast } from "react-toastify";

const Wishlists = () => {
  const { data, isLoading } = useGetWishlistsQuery();
  const wishlistItems = Array.isArray(data) ? data : data?.content || data?.data || data?.wishlists || [];
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();
  const [clearWishlist, { isLoading: isClearing }] = useClearWishlistMutation();
  const { addToCart } = useOutletContext();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      toast.error(error?.data?.message || "Failed to remove from wishlist");
    }
  };

  const handleMoveToCart = async (item, product) => {
    try {
      // Opt 1: Use the global context addToCart (which opens drawer & updates backend)
      await addToCart({ 
        id: product.productId || product.id || item.id, 
        name: product.name || product.productName, 
        price: product.price, 
        image: product.imageUrl ? `/uploads/${product.imageUrl}` : "/uploads/not-found.avif", 
        stock: product.stockQuantity ?? product.stock 
      });
      // Optionally also remove from wishlist since it's "moved"
      // await removeFromWishlist(product.productId || product.id).unwrap();
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist().unwrap();
      toast.success("Wishlist cleared");
      setIsClearModalOpen(false);
    } catch (error) {
      console.error("Failed to clear wishlist", error);
      toast.error("Failed to clear wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 mt-20">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your wishlist yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Explore Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 md:pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              My Wishlist
            </h1>
            <span className="ml-2 px-3 py-1 bg-pink-100 text-pink-600 text-sm font-semibold rounded-full items-center">
              {wishlistItems.length} items
            </span>
          </div>
          
          <button 
            onClick={() => setIsClearModalOpen(true)}
            disabled={isClearing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => {
              // Handle flat properties or nested product object
              const product = item.product || item;
              const productId = product.productId || product.id;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl ? `/uploads/${product.imageUrl}` : "/uploads/not-found.avif"}
                      alt={product.name || product.productName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Remove Button overlay */}
                    <button
                      onClick={() => handleRemove(productId)}
                      className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 hover:text-white hover:bg-red-500 rounded-full shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Stock Indicator */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm shadow border border-white/20">
                      <Package className="w-3 h-3" />
                      {product.stockQuantity ?? product.stock ?? 0} in stock
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    {product.category && (
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1.5 block">
                        {product.category.name || product.category}
                      </span>
                    )}
                    
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                      {product.name || product.productName}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-gray-900">${Number(product.price || 0).toFixed(2)}</span>
                      <button
                        onClick={() => handleMoveToCart(item, product)}
                        disabled={(product.stockQuantity ?? product.stock ?? 0) === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Clear Wishlist Modal */}
      <AnimatePresence>
        {isClearModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6 pt-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Wishlist?</h3>
                <p className="text-gray-500">
                  Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  disabled={isClearing}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Clear It"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlists;