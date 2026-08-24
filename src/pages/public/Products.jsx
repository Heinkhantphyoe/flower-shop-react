import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X, ChevronDown, Check } from "lucide-react";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import { useGetProductsQuery, useGetCategoriesQuery } from "../../api/productApi";
import Loading from "../../components/Loading";
import { useSearchParams } from "react-router";
import ProductDetailModal from "../../components/ProductDetailModal";

const SORT_OPTIONS = [
  { label: "Default", sortBy: "", sortOrder: "" },
  { label: "Name A\u2013Z", sortBy: "name", sortOrder: "asc" },
  { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { label: "Newest", sortBy: "id", sortOrder: "desc" },
];

const Dropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 pl-3 pr-3 py-2 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 ${
          open ? "border-pink-300 shadow-sm" : "border-gray-200"
        }`}
      >
        <span className={`truncate ${selected ? "text-gray-800" : "text-gray-400"}`}>
          {selected ? selected.label : label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-pink-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-auto bg-white/95 backdrop-blur-xl border border-pink-100 rounded-2xl shadow-xl p-1.5 origin-top"
          >
            {options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                  opt.value === value
                    ? "bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <Check className="w-4 h-4 text-pink-500 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const pageParam = parseInt(searchParams.get("page"), 10);

  // Local input state; committed to the URL on Enter/blur
  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  useEffect(() => {
    setSearchInput(search);
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
  }, [search, minPrice, maxPrice]);

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next);
  };

  const setParam = (key, value) => updateParams({ [key]: value });

  const clearFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchParams({});
  };

  const hasFilters =
    !!(search || categoryId || minPrice || maxPrice || sortBy);

  const { data, error, isLoading } = useGetProductsQuery({
    page: currentPage - 1,
    ...(search && { name: search }),
    ...(categoryId && { categoryId }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sortBy && { sortBy, sortOrder: sortOrder || "asc" }),
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data?.items || [];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  const products = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-700 text-xl font-semibold mb-2">Oops! Something went wrong.</p>
          <p className="text-gray-600">Please try refreshing the page or come back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 min-h-screen px-4 sm:px-6 pt-32 md:pt-28 pb-20">
      {/* Filter Bar */}
      <div className="relative z-20 max-w-7xl mx-auto mb-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <SlidersHorizontal className="w-4 h-4 text-pink-500" />
          <span className="font-semibold text-sm uppercase tracking-wide">Filters</span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <form
            className="relative sm:col-span-2"
            onSubmit={(e) => {
              e.preventDefault();
              setParam("search", searchInput.trim());
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onBlur={() => {
                if (searchInput.trim() !== search) setParam("search", searchInput.trim());
              }}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </form>

          {/* Category */}
          <Dropdown
            label="All Categories"
            value={categoryId}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((cat) => ({ label: cat.name, value: String(cat.id) })),
            ]}
            onChange={(v) => setParam("categoryId", v)}
          />

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Min $"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={() => {
                if (minPriceInput !== minPrice) setParam("minPrice", minPriceInput);
              }}
              onKeyDown={(e) => e.key === "Enter" && setParam("minPrice", minPriceInput)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <span className="text-gray-400 text-sm shrink-0">&ndash;</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Max $"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={() => {
                if (maxPriceInput !== maxPrice) setParam("maxPrice", maxPriceInput);
              }}
              onKeyDown={(e) => e.key === "Enter" && setParam("maxPrice", maxPriceInput)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Sort */}
          <Dropdown
            label="Sort By"
            value={sortBy ? `${sortBy}-${sortOrder}` : ""}
            options={SORT_OPTIONS.map((opt) => ({
              label: opt.label,
              value: opt.sortBy ? `${opt.sortBy}-${opt.sortOrder}` : "",
            }))}
            onChange={(v) => {
              if (!v) {
                updateParams({ sortBy: "", sortOrder: "" });
              } else {
                const [sb, so] = v.split("-");
                updateParams({ sortBy: sb, sortOrder: so });
              }
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        /* Empty Results */
        <div className="max-w-md mx-auto mt-16 mb-24 text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-pink-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Nothing matches your current search or filters.
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto ">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                discountPrice={product.discountPrice}
                stock={product.stock}
                image={`/uploads/${product.imageUrl}`}
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setParam("page", p === 1 ? "" : String(p))}
          />
        </>
      )}

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
