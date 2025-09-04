import { motion } from "framer-motion";
import { X, Trash2, Minus, Plus, MoveUpRight } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useClearCartMutation, useRemoveCartItemMutation, useUpdateCartItemMutation } from "../features/product/cartApi";
import { useState } from "react";

const CartDrawer = ({
    isOpen,
    onClose,
    cartItems = [],
}) => {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const total = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeCartItem] = useRemoveCartItemMutation();
    const [clearCart] = useClearCartMutation();

    const onUpdateQuantity = async (itemId, newQuantity) => {
        try {
            await updateCartItem({ cartItemId: itemId, quantity: newQuantity }).unwrap();
        } catch (error) {
            toast.error(error?.message || 'Failed to update quantity');
        }
    };

    const onRemoveItem = async (itemId) => {
        try {
            await removeCartItem({ cartItemId: itemId }).unwrap();
            toast.success('Item removed from cart');
        } catch (error) {
            console.log(error);

            toast.error(error?.message || 'Failed to remove item');
        }
    };

    const onClearConfirm = async () => {
        try {
            await clearCart(); 
            toast.success('All items cleared from cart');
            onClose();
        } catch (error) {
            toast.error(error?.message || 'Failed to clear cart');
        }   
    };



    return createPortal(
        <>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-[100dvh] z-[10000] w-full max-w-md bg-white shadow-xl rounded-l-2xl overflow-hidden"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center p-5 border-b border-rose-100">
                                <h2 className="text-2xl font-bold text-pink-600">Shopping Cart</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-rose-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 space-y-4">
                                        <div className="text-5xl">🛒</div>
                                        <p className="text-lg font-semibold">Your cart is empty</p>
                                        <p className="text-sm text-gray-400">Looks like you haven’t added anything yet.</p>

                                    </div>
                                ) : (
                                    <ul className="divide-y divide-rose-100">
                                        {cartItems.map((item, index) => {
                                            const outOfStock = item.quantity >= item.stock;
                                            return (
                                                <li key={index} className="flex gap-4 py-4 items-center">
                                                    <img
                                                        src={`/uploads/${item.imageUrl}`}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg border border-rose-200 shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-700">{item.productName}</p>
                                                        <p className="text-sm text-gray-500">
                                                            ${item.price} × {item.quantity}
                                                        </p>

                                                        {/* Quantity Control */}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <button
                                                                onClick={() =>

                                                                    onUpdateQuantity(item.id, item.quantity - 1)
                                                                }
                                                                className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded-full"
                                                            >
                                                                <Minus className="w-4 h-4 text-rose-600" />
                                                            </button>
                                                            <span className="text-sm font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => {
                                                                    if (!outOfStock) {
                                                                        onUpdateQuantity(item.id, item.quantity + 1)
                                                                    } else {
                                                                        toast.warn("Cannot add more than available stock");
                                                                    }
                                                                }}
                                                                className="p-1.5 rounded-full transition-all bg-rose-100 hover:bg-rose-200 text-rose-600" >
                                                                <Plus className="w-4 h-4 text-rose-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="text-rose-400 hover:text-rose-600 p-2"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </li>
                                            )

                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Footer */}
                            {cartItems.length > 0 &&
                                (
                                    <div className="p-5 border-t border-rose-100">
                                        <div className="flex justify-between text-lg font-semibold text-gray-700 mb-4">
                                            <span>Total</span>
                                            <span>${total}</span>
                                        </div>

                                        <div className="flex w-full gap-3">

                                            <button onClick={() => setIsDeleteModalOpen(true)} className="flex-[2] group relative flex items-center justify-center gap-2 py-2 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <span className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 bg-gradient-to-r from-red-500 via-rose-500 to-pink-600"></span>
                                                <Trash2 className="relative z-10 w-5 h-5" />
                                                <span className="relative z-10">Clear All Cart</span>
                                            </button>

                                            {isDeleteModalOpen && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                                                    <div className="bg-white rounded-2xl p-6 shadow-xl w-80 text-center">
                                                        <h2 className="text-lg font-semibold mb-4">
                                                            Are you sure to clear all items in your cart?
                                                        </h2>
                                                        <div className="flex gap-3 justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    onClearConfirm(); 
                                                                    setIsDeleteModalOpen(false);
                                                                }}
                                                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                                                            >
                                                                Yes, Clear
                                                            </button>
                                                            <button
                                                                onClick={() => setIsDeleteModalOpen(false)}
                                                                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}


                                            <button className="flex-[3] group relative flex items-center justify-center gap-2 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                                <span className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500"></span>
                                                <span className="relative z-10">Proceed to Checkout</span>
                                                <MoveUpRight className="relative z-10" />
                                            </button>


                                        </div>
                                    </div>
                                )}
                        </div>
                    </motion.div>
                </>
            )}
        </>,
        document.body
    );
};

export default CartDrawer;
