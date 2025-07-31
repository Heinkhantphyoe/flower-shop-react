import { useState } from "react";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../features/product/productApi";
import Loading from "../components/Loading";
import { useSearchParams } from "react-router";


const Products = () => {

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useGetProductsQuery({ page: currentPage - 1, categoryId });



  const flowers = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;


  if (isLoading) return <Loading />;
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
    <div className="bg-pink-50 min-h-screen p-6 mt-20 md:mt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto ">
        {flowers.map((flower) => (
          <ProductCard
            key={flower.id}
            name={flower.name}
            description={flower.description}
            price={flower.price}
            image={`/uploads/${flower.imageUrl}`}
            onAddToCart={() => handleAddToCart(flower.name)}
          />
        ))}
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Products;
