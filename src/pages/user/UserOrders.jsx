import React, { useState } from "react";
import {
  Package,
  ChevronDown,
  MapPin,
  Tag,
  Truck,
  X,
  Loader2,
  AlertTriangle,
  Ban,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "../../api/orderApi";
import Pagination from "../../components/Pagination";

const ORDERS_PER_PAGE = 5;

const STATUS_FILTERS = [
  { label: "All", value: null },
  { label: "Pending", value: 0 },
  { label: "Confirmed", value: 1 },
  { label: "Delivered", value: 2 },
  { label: "Cancelled", value: 3 },
];

const STATUS_CHIP_CLASS = {
  DELIVERED: "bg-green-100 text-green-700 border border-green-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border border-blue-200",
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  CANCELLED: "bg-red-100 text-red-600 border border-red-200",
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const UserOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [brokenProofs, setBrokenProofs] = useState({});

  const markProofBroken = (orderId) =>
    setBrokenProofs((prev) => ({ ...prev, [orderId]: true }));

  const { data: ordersData, isLoading, isError } = useGetMyOrdersQuery({
    page: currentPage - 1,
    size: ORDERS_PER_PAGE,
    sortBy: 'orderDate',
    sortOrder: 'desc',
    ...(statusFilter !== null && { orderStatus: statusFilter }),
  });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = ordersData?.data?.items || [];
  const totalOrders = ordersData?.data?.totalItems || 0;
  const totalPages = ordersData?.data?.totalPages || 1;
  const activeStatusLabel =
    STATUS_FILTERS.find((filter) => filter.value === statusFilter)?.label || "";

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const toggleExpand = (orderId) =>
    setExpandedId((prev) => (prev === orderId ? null : orderId));

  const handleCancelConfirm = async () => {
    try {
      await cancelOrder(cancelTarget.id).unwrap();
      toast.success("Order cancelled successfully");
      setCancelTarget(null);
    } catch (error) {
      console.error("Failed to cancel order", error);
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 mt-20">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-gray-600">Failed to load your orders.</p>
      </div>
    );
  }

  if (!isLoading && statusFilter === null && totalOrders === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 mt-20">
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-500 mb-8">
            When you place an order, it will show up here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              My Orders
            </h1>
            <span className="ml-2 px-3 py-1 bg-pink-100 text-pink-600 text-sm font-semibold rounded-full">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"}
            </span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === filter.value
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                  : "bg-white/80 text-gray-600 border border-gray-200 hover:border-pink-300 hover:text-pink-500"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center max-w-md mx-auto mt-8"
          >
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-5">
              <Package className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No {activeStatusLabel || "Matching"} Orders
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              You don't have any {activeStatusLabel.toLowerCase() || "matching"} orders right now.
            </p>
            {statusFilter !== null && (
              <button
                onClick={() => handleFilterChange(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Show All Orders
              </button>
            )}
          </Motion.div>
        ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const subtotal = (order.items || []).reduce(
                (sum, item) => sum + Number(item.price || 0),
                0
              );

              return (
                <Motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-shadow duration-300"
                >
                  {/* Card Header (always visible) */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full flex flex-wrap items-center gap-x-6 gap-y-3 p-5 sm:p-6 text-left cursor-pointer"
                  >
                    {/* Order info */}
                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">
                          Order #{order.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            STATUS_CHIP_CLASS[order.status] ||
                            "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.orderDate)} ·{" "}
                        {(order.items || []).length}{" "}
                        {(order.items || []).length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.status === "PENDING" && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancelTarget(order);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              setCancelTarget(order);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium text-sm transition-colors cursor-pointer"
                        >
                          <Ban className="w-4 h-4" />
                          Cancel
                        </span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <Motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-gray-100 space-y-5">
                          {/* Items */}
                          <div className="pt-4 space-y-3">
                            {(order.items || []).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 bg-gray-50/80 rounded-2xl p-3"
                              >
                                <img
                                  src={
                                    item.productImageUrl
                                      ? `/uploads/${item.productImageUrl}`
                                      : "/uploads/not-found.avif"
                                  }
                                  alt={item.productName}
                                  onError={(e) => {
                                    if (!e.currentTarget.src.endsWith("not-found.avif")) {
                                      e.currentTarget.src = "/uploads/not-found.avif";
                                    }
                                  }}
                                  className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <span className="font-bold text-gray-900 whitespace-nowrap">
                                  ${Number(item.price || 0).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Shipping + Payment proof */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4">
                              <MapPin className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-0.5">
                                  Delivery Address
                                </p>
                                <p className="text-sm text-gray-500">
                                  {order.orderAddress}
                                  {order.city ? `, ${order.city}` : ""}
                                  {order.zipCode ? ` ${order.zipCode}` : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4">
                              <Truck className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-0.5">
                                  {order.status === "DELIVERED"
                                    ? "Delivered on"
                                    : "Payment Proof"}
                                </p>
                                {order.status === "DELIVERED" ? (
                                  <p className="text-sm text-gray-500">
                                    {formatDate(order.deliveryDate)}
                                  </p>
                                ) : order.paymentSs && !brokenProofs[order.id] ? (
                                  <a
                                    href={`/uploads/${order.paymentSs}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-1"
                                  >
                                    <img
                                      src={`/uploads/${order.paymentSs}`}
                                      alt="Payment screenshot"
                                      onError={() => markProofBroken(order.id)}
                                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 hover:border-pink-300 transition-colors"
                                    />
                                  </a>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    {order.paymentSs
                                      ? "Screenshot file unavailable"
                                      : "No payment screenshot"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {order.couponCode && (
                              <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-1.5">
                                  <Tag className="w-4 h-4" />
                                  Coupon {order.couponCode}
                                </span>
                                <span>
                                  -${Number(order.discountAmount || 0).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                              <span>Shipping</span>
                              <span>$5.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                              <span>Total</span>
                              <span>${Number(order.totalPrice || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setCancelTarget(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6 pt-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <Ban className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Cancel Order #{cancelTarget.id}?
                </h3>
                <p className="text-gray-500">
                  This will cancel your pending order. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isCancelling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Yes, Cancel It"
                  )}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOrders;
