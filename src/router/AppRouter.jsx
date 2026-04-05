import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Login from '../pages/auth/Login';
import Home from '../pages/public/Home';
import AdminDashboard from '../pages/admin/AdminDashboard';
import RequireAuth from './RequireAuth';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import Products from '../pages/public/Products';
import UserProfile from '../pages/user/UserProfile';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Register from '../pages/auth/Register';
import OtpConfirmation from '../pages/auth/OtpConfirmation';
import ResetPassword from '../pages/auth/ResetPassword';
import CustomError from '../pages/public/CustomError';
import AboutUs from '../pages/public/AboutUs';


const router = createBrowserRouter([
  {
    // Public and shared routes
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'otp-confirmation',
        element: <OtpConfirmation />,
      },
      {
        path: "about-us",
        element: <AboutUs />
      },
      {
        path: 'products',
        element: <Products/>
      }

    ]
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  {
    path: 'unauthorized',
    element: <CustomError errorCode={401} message={"You are not authorized to access this page"} />,
  },
  {
    // Protected user routes
    element: <RequireAuth allowedRoles={['ROLE_USER']} />,
    children: [
      {
        path: '/user',
        element: <UserLayout />,
        children: [
          {
            path: 'profile',
            element: <UserProfile />,
          },
          // {
          //   path: 'orders',
          //   element: <UserOrders />,
          // },
          // {
          //   path: 'wishlist',
          //   element: <Wishlist />,
          // },
          // {
          //   path: 'cart',
          //   element: <Cart />,
          // },
        ],
      },
    ],
  },
  {
    // Protected admin routes
    element: <RequireAuth allowedRoles={['ROLE_ADMIN']} />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          // {
          //   path: 'users',
          //   element: <Users />,
          // },
          // {
          //   path: 'products',
          //   element: <ProductsManagement />, // Only admin management, not viewing
          // },
          // {
          //   path: 'orders',
          //   element: <OrdersManagement />,
          // },
          // {
          //   path: 'categories',
          //   element: <Categories />,
          // },
          // {
          //   path: 'analytics',
          //   element: <Analytics />,
          // },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <CustomError errorCode={404} message={"Page not found"} />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
