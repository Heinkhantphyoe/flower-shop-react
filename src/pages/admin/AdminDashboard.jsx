import { useState } from "react";
import {
  Bell,
  Flower,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Menu,
  X,
  Home,
  Settings,
  BarChart3,
  UserCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const products = [
    { id: 1, name: "Rose Bouquet", price: "$45", stock: 23, category: "Bouquets" },
    { id: 2, name: "Tulip Arrangement", price: "$35", stock: 18, category: "Arrangements" },
    { id: 3, name: "Sunflower Bundle", price: "$28", stock: 45, category: "Singles" },
    { id: 4, name: "Wedding Package", price: "$250", stock: 5, category: "Packages" }
  ];

  const orders = [
    { id: 1, customer: "Sarah Johnson", product: "Rose Bouquet", status: "Pending", total: "$45" },
    { id: 2, customer: "Mike Chen", product: "Wedding Package", status: "Completed", total: "$250" },
    { id: 3, customer: "Emma Davis", product: "Tulip Arrangement", status: "Processing", total: "$35" }
  ];

  const customers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", orders: 5, spent: "$225" },
    { id: 2, name: "Mike Chen", email: "mike@email.com", orders: 2, spent: "$500" },
    { id: 3, name: "Emma Davis", email: "emma@email.com", orders: 8, spent: "$340" }
  ];

  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "products", name: "Products", icon: Flower },
    { id: "orders", name: "Orders", icon: Package },
    { id: "customers", name: "Customers", icon: Users },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "profile", name: "Profile", icon: UserCircle },
    { id: "settings", name: "Settings", icon: Settings }
  ];

  const renderDashboard = () => (
    <>
      {/* Statistic Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="bg-pink-100 p-3 rounded-xl">
            <Flower className="text-pink-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="text-xl font-semibold text-pink-600">245</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="bg-pink-100 p-3 rounded-xl">
            <Package className="text-pink-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">New Orders</p>
            <h2 className="text-xl font-semibold text-pink-600">58</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="bg-pink-100 p-3 rounded-xl">
            <Users className="text-pink-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <h2 className="text-xl font-semibold text-pink-600">1,230</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="bg-pink-100 p-3 rounded-xl">
            <DollarSign className="text-pink-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Sales</p>
            <h2 className="text-xl font-semibold text-pink-600">$4,870</h2>
          </div>
        </div>
      </section>

      {/* Charts and Recent Orders */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-pink-600">{order.total}</p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
            <div className="text-center">
              <TrendingUp className="text-pink-400 mx-auto mb-3" size={48} />
              <p className="text-pink-600 font-medium">Sales Chart</p>
              <p className="text-sm text-gray-500">Chart implementation here</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 transition-colors">
            <Plus size={20} />
            Add Product
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.filter(product => 
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(product => (
              <tr key={product.id} className="hover:bg-pink-25">
                <td className="px-6 py-4 text-gray-800 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">{product.price}</td>
                <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:bg-green-50 p-1 rounded">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-pink-25">
                <td className="px-6 py-4 text-gray-800 font-medium">#{order.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.product}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{order.total}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:bg-green-50 p-1 rounded">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customers</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Orders</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Spent</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-pink-25">
                <td className="px-6 py-4 text-gray-800 font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-gray-600">{customer.orders}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{customer.spent}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:bg-green-50 p-1 rounded">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
      <div className="max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <img
            src="https://i.pravatar.cc/100"
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full border-4 border-pink-200"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Admin User</h3>
            <p className="text-gray-600">admin@flowerstore.com</p>
            <button className="mt-2 text-pink-600 hover:text-pink-700 font-medium">Change Avatar</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
              defaultValue="Admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
              defaultValue="User"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
              defaultValue="admin@flowerstore.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
              defaultValue="+1 (555) 123-4567"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analytics Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
          <div className="text-center">
            <BarChart3 className="text-pink-400 mx-auto mb-3" size={48} />
            <p className="text-pink-600 font-medium">Analytics Dashboard</p>
            <p className="text-sm text-gray-500">Advanced analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      <div className="max-w-2xl space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <button className="bg-pink-600 relative inline-flex h-6 w-11 rounded-full transition-colors">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform transform translate-x-5"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <button className="bg-gray-300 relative inline-flex h-6 w-11 rounded-full transition-colors">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform transform translate-x-0"></span>
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Store Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
                defaultValue="Beautiful Flowers Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
                rows={3}
                defaultValue="123 Flower Street, Garden City, GC 12345"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "orders":
        return renderOrders();
      case "customers":
        return renderCustomers();
      case "analytics":
        return renderAnalytics();
      case "profile":
        return renderProfile();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white shadow-lg flex flex-col`}>
        <div className="p-6 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <Flower className="text-pink-600" size={32} />
            {sidebarOpen && <h1 className="text-xl font-bold text-pink-600">FlowerAdmin</h1>}
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-pink-100 text-pink-700 font-medium'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white px-6 py-4 shadow-sm border-b border-pink-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-2xl font-bold text-pink-600 capitalize">
              {currentPage === "dashboard" ? "Dashboard" : currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-pink-500 cursor-pointer hover:text-pink-600" />
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border border-pink-200 cursor-pointer"
              onClick={() => setCurrentPage("profile")}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}