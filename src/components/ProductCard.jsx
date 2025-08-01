import React, { useState } from "react";
import { Heart, ShoppingCart, Eye, Package } from "lucide-react";
import { useOutletContext } from "react-router";
import notFoundImage from "../.././public/uploads/not-found.avif"; 

const ProductCard = ({
  id,
  name = "Premium Wireless Headphones",
  price = "$299.99",
  image = notFoundImage,
  isNew = false,
  category = "",
  stock = 10,
  loading = false,
  onQuickView = () => { },
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useOutletContext();


  if (loading) {
    return (
      <div className="relative w-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow animate-pulse h-[400px]">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
    >
      {/* Top Section */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 left-3">
            <div className="text-xs bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-lg">
              New Arrival
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex flex-row gap-2">
          <button
            onClick={onQuickView}
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToCart({ id, name, price, image, stock })}
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          <Package className="w-3 h-3" />
          {stock} in stock
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {category && (
          <span className="text-xs font-medium text-violet-600 uppercase tracking-wider">
            {category}
          </span>
        )}

        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors duration-300">
          {name}
        </h3>


        <div className="pt-2">
          <span className="text-lg font-bold text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
