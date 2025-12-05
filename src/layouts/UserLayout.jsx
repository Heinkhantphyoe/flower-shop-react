import { Outlet } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetCartQuery, useAddToCartMutation } from '../features/product/cartApi';

const UserLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [addToCartApi] = useAddToCartMutation();
  const { data: cartData, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Do not fetch if user not logged in
  });
 

  const addToCart = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        toast.info('Please log in to add items to your cart');
        return;
      }
      console.log('Adding to cart:', product);
      try {
        await addToCartApi({ 
          productId: product.id, 
          quantity: 1,
          productName: product.name,
          price: product.price,
          imageUrl: product.image,
        }).unwrap();
        toast.success(`${product.name} added to cart`);
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to add to cart');
      }
    },
    [isAuthenticated, addToCartApi]
  );

  return (
    <>
      <Navbar
        cartCount={
          isLoading
            ? 0
            : cartData?.cartItems?.length || 0
        }
        onCartClick={() => setDrawerOpen(true)}
      />

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartItems={cartData?.cartItems || []} // 
        isLoading={isLoading}
      />

      <Outlet context={{ addToCart }} />
    </>
  );
};

export default UserLayout;
