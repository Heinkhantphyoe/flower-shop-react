import { Outlet } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UserLayout = () => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const quantityInCart = existing?.quantity || 0;

      if (quantityInCart >= product.stock) {
        toast.warn("Cannot add more than available stock");
        return prev;
      }
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setDrawerOpen(true);
  }, [isAuthenticated]);

  return (
    <>
      <Navbar
        cartCount={(cartItems || []).reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setDrawerOpen(true)}
      />

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, newQty) => {
          if (newQty <= 0) {
            setCartItems(cartItems.filter((item) => item.id !== id));
          } else {
            setCartItems(
              cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQty } : item
              )
            );
          }
        }}
        onRemoveItem={(id) =>
          setCartItems(cartItems.filter((item) => item.id !== id))
        }
      />

      {/* Share `addToCart` function with all children  */}
      <Outlet context={{ addToCart }} />
    </>
  );
};

export default UserLayout;
