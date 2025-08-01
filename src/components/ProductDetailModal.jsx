import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingCart,
  CreditCard,
  MessageCircleMore,
} from "lucide-react";
import { useOutletContext } from "react-router";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.2 } },
};

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  const { addToCart } = useOutletContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative w-[94%] sm:w-[90%] max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/30 shadow-[0_12px_50px_-10px_rgba(0,0,0,0.3)] rounded-[2rem] p-6 sm:p-8 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Product Image */}
            <div className="relative mb-6 overflow-hidden rounded-2xl shadow-xl group">
              <img
                src={`/uploads/${product.imageUrl}`}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isNew && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs px-3 py-1 rounded-full shadow">
                  New Arrival
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              {/* Category */}
              {product.category && (
                <p className="text-xs text-violet-600 uppercase font-semibold tracking-wider">
                  {product.category}
                </p>
              )}

              {/* Title */}
              <h2 className="text-xl font-extrabold text-gray-900">{product.name}</h2>

              {/* Ratings */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                    ))}
                  <span className="ml-2 text-gray-600">(24 reviews)</span>
                </div>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full hover:bg-violet-200 transition-all">
                  <MessageCircleMore className="w-4 h-4" />
                  Write a review
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Price + Stock */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-xl font-bold text-violet-700">{product.price}</div>
                  {/* Optional offer: */}
                  {/* <div className="text-sm line-through text-gray-400">$399.99</div> */}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-gray-800 bg-white/70 backdrop-blur-sm border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[15px]">{product.stock} in stock</span>
                </div>

              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button onClick={() => addToCart({ id:product.id, name:product.name, price:product.price,  image: `/uploads/${product.imageUrl}`, stock: product.stock })} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-violet-700 border border-violet-600 font-semibold hover:bg-violet-50 hover:scale-[1.02] active:scale-95 transition-all shadow-md">
                  <CreditCard className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
