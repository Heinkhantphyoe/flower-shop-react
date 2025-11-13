import { motion } from "framer-motion";
import { X, Trash2, Minus, Plus, MoveUpRight } from "lucide-react";
import { toast } from "react-toastify";
import { useClearCartMutation, useRemoveCartItemMutation, useUpdateCartItemMutation } from "../features/product/cartApi";
import { useState } from "react";
import { useCreateOrderMutation } from "../features/order/orderApi";

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
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

    //order apis
    const [createOrder] = useCreateOrderMutation();

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        zipCode: '',
        deliveryNote: ''
    });
    const [paymentImage, setPaymentImage] = useState(null);
    const [paymentPreview, setPaymentPreview] = useState(null);

    const onUpdateQuantity = async (itemId, newQuantity) => {
        try {
            await updateCartItem({ cartItemId: itemId, quantity: newQuantity }).unwrap();
        } catch (error) {
            toast.error(error?.message || 'Failed to update quantity');
        }
    };

    const handleCheckOut = () => {
        onClose();
        setIsCheckOutOpen(true);
    }

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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    




    const handleSubmitOrder = async () => {

        const formDataToSend = new FormData();
        formDataToSend.append("paymentSs", paymentImage); 
        formDataToSend.append("orderAddress", formData.address);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("zipCode", formData.zipCode);
        formDataToSend.append("deliveryNotes", formData.deliveryNote);

        cartItems.forEach((item, index) => {            
            formDataToSend.append(`orderItems[${index}].productId`, item.productId);
            formDataToSend.append(`orderItems[${index}].quantity`, item.quantity);
        });

        try {
            await createOrder(formDataToSend).unwrap();
            toast.success('Order placed successfully!');
            setIsCheckOutOpen(false);
            // Optional: Clear cart after successful order
            await clearCart();
            //clear form data
            setFormData({
                address: '',
                city: '',
                zipCode: '',
                deliveryNote: ''
            });
            setPaymentImage(null);
            setPaymentPreview(null);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to place order');
        }
    };

    return (
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


                                            <button onClick={handleCheckOut} className="flex-[3] group relative flex items-center justify-center gap-2 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
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
            {/* checkout modal */}
            {isCheckOutOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCheckOutOpen(false)}
                    />

                    <motion.div
                        className="fixed z-[10000] h-[95vh] md:h-auto w-[95%] md:w-[85%] md:max-w-4xl bg-white 
                      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      rounded-2xl shadow-xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="flex flex-col h-full md:h-auto">
                            {/* Header */}
                            <div className="flex-none flex justify-between items-center border-b border-rose-100 p-3 md:px-8 md:py-4">
                                <h2 className="text-xl md:text-2xl font-bold text-pink-600">Checkout</h2>
                                <button onClick={() => setIsCheckOutOpen(false)} className="p-2 hover:bg-rose-100 rounded-full">
                                    <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto md:overflow-y-auto">
                                <div className="p-3 md:px-8 md:py-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                        {/* Left Column - Form */}
                                        <div className="space-y-3 mb-4 md:mb-0">
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-gray-700">Shipping Information</h3>
                                                {/* <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Full Name"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-rose-200 rounded-xl px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm md:text-base"
                                                />
                                                 */}
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Delivery Address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-rose-200 rounded-xl px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm md:text-base"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        placeholder="City"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-rose-200 rounded-xl px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm md:text-base"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        placeholder="ZIP Code"
                                                        value={formData.zipCode}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-rose-200 rounded-xl px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm md:text-base"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="deliveryNote"
                                                    placeholder="Delivery Note(Optional)"
                                                    value={formData.deliveryNote}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-rose-200 rounded-xl px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm md:text-base"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-gray-700">Payment Proof</h3>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">
                                                        Please upload a screenshot of your payment
                                                    </p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePaymentImageChange}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                                                    />
                                                    {paymentPreview && (
                                                        <div className="mt-4 relative">
                                                            <img
                                                                src={paymentPreview}
                                                                alt="Payment proof"
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setPaymentImage(null);
                                                                    setPaymentPreview(null);
                                                                }}
                                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Order Summary */}
                                        <div className="bg-rose-50 rounded-xl p-4 mb-4 md:mb-0">
                                            <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
                                            {/* Items list with adjusted height */}
                                            <div className="space-y-2 h-[30vh] md:h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50 pr-2">
                                                {cartItems.map((item, index) => (
                                                    <div key={index} className="flex gap-3 py-2">
                                                        <img
                                                            src={`/uploads/${item.imageUrl}`}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">{item.productName}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Summary section */}
                                            <div className="border-t border-rose-200 mt-3 pt-3 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-medium">${total}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Shipping</span>
                                                    <span className="font-medium">$5.00</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-semibold pt-2">
                                                    <span className="text-gray-700">Total</span>
                                                    <span className="text-pink-600">${(parseFloat(total) + 5).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Complete order button */}
                                            <button
                                                onClick={handleSubmitOrder}
                                                disabled={!paymentImage || !formData.address || !formData.city || !formData.zipCode}
                                                className="w-full mt-4 group relative flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="absolute -inset-0.5 rounded-xl blur opacity-20 group-hover:opacity-40 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500"></span>
                                                <span className="relative z-10">Complete Order</span>
                                                <MoveUpRight className="relative z-10 w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
};

export default CartDrawer;
