import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Flower2,
  Star,
  ArrowRight,
  Leaf,
  Sun,
  Heart,
  Truck,
  ShieldCheck,
  Headphones,
  Quote,
  Gift,
  Copy,
  Check,
  Send,
  Mail,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import bg1 from '../../assets/images/bg1.avif';
import bg2 from '../../assets/images/bg2.avif';
import bg3 from '../../assets/images/bg3.jpg';
import flowerImg from '../../assets/images/flower.avif';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../api/productApi';
import { useGetCouponsQuery } from '../../api/couponApi';
import ProductCard from '../../components/ProductCard';
import ProductDetailModal from '../../components/ProductDetailModal';

const heroSlides = [
  {
    title: 'Brighten Their Day',
    subtitle: 'with Premium Blooms',
    image: bg1,
    accent: 'Handpicked • Fresh • Beautiful',
  },
  {
    title: 'Express Your Love',
    subtitle: "through Nature's Art",
    image: bg2,
    accent: 'Romantic • Elegant • Timeless',
  },
  {
    title: 'Celebrate Every Moment',
    subtitle: 'with Perfect Arrangements',
    image: bg3,
    accent: 'Special • Memorable • Stunning',
  },
];

const categoryIcons = [Flower2, Leaf, Sun, Heart, Flower2, Leaf];

const features = [
  {
    icon: Flower2,
    title: 'Fresh Every Day',
    description: 'Locally sourced blooms handpicked each morning for lasting beauty.',
  },
  {
    icon: Truck,
    title: 'Same-Day Delivery',
    description: 'Order before noon and brighten someones day by this evening.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: 'Every transaction is encrypted and protected end to end.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Floral advice whenever you need it via chat or phone.',
  },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Regular Customer',
    rating: 5,
    text: 'The anniversary bouquet was absolutely stunning. Fresh, fragrant and arranged with such care — my wife loved it!',
  },
  {
    name: 'David Chen',
    role: 'Birthday Order',
    rating: 5,
    text: 'Ordered same-day delivery for my moms birthday and it arrived within hours. The flowers were gorgeous and full of life.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Wedding Client',
    rating: 5,
    text: 'They handled all the arrangements for our wedding. Professional, creative and the venue looked magical. Highly recommended!',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forgotPassSuccess, loginSuccess } = location.state || {};
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copiedCouponId, setCopiedCouponId] = useState(null);
  const [email, setEmail] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ page: 0 });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: couponsData } = useGetCouponsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const featuredProducts = (productsData?.data?.items || []).slice(0, 8);
  const categories = categoriesData?.data?.items || [];

  const validCoupons = (Array.isArray(couponsData) ? couponsData : couponsData?.data || [])
    .filter(
      (coupon) =>
        coupon.active && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())
    )
    .slice(0, 3);

  useEffect(() => {
    const showToastIfExists = (message) => {
      if (message) toast.success(message);
    };

    showToastIfExists(loginSuccess);
    showToastIfExists(forgotPassSuccess);

    if (loginSuccess || forgotPassSuccess) {
      navigate(location.pathname, { replace: true });
    }
    setIsLoaded(true);
  }, [loginSuccess, forgotPassSuccess, location.pathname, navigate]);

  const handleCopyCoupon = (coupon) => {
    navigator.clipboard
      .writeText(coupon.code)
      .then(() => {
        setCopiedCouponId(coupon.id);
        toast.success(`Code ${coupon.code} copied!`);
        setTimeout(() => setCopiedCouponId(null), 2000);
      })
      .catch(() => toast.error('Failed to copy code'));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Welcome to the garden! Fresh deals are on their way.');
    setEmail('');
  };

  return (
    <div className="font-sans text-gray-800 bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <Motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroSlides[currentSlide].image}')` }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-pink-900/40" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              {heroSlides[currentSlide].accent}
            </Motion.div>

            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200 tracking-tight leading-tight">
              {heroSlides[currentSlide].title}
              <br />
              <span className="text-4xl md:text-6xl">{heroSlides[currentSlide].subtitle}</span>
            </h1>

            <p className="text-white/80 mt-6 text-xl md:text-2xl font-light max-w-2xl mx-auto">
              Experience luxury floral arrangements crafted with passion and delivered with care
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 text-lg font-semibold"
              >
                Our Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about-us"
                className="group inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-lg font-medium"
              >
                <Flower2 className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                About Us
              </Link>
            </div>
          </Motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      {(categoriesLoading || categories.length > 0) && (
        <section className="bg-white py-20 px-4 sm:px-6">
          <Motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 bg-pink-50 border border-pink-100 rounded-full text-pink-600 text-xs font-semibold uppercase tracking-wider mb-4">
                <Leaf className="w-3.5 h-3.5 mr-1.5" />
                Browse Collections
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Find the perfect arrangement for every occasion and every person you love
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5">
              {categoriesLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[calc(50%-0.625rem)] sm:w-56 h-44 bg-gray-100 rounded-3xl animate-pulse"
                    />
                  ))
                : categories.slice(0, 5).map((category, index) => {
                    const Icon = categoryIcons[index % categoryIcons.length];
                    return (
                      <Motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.5 }}
                      >
                        <Link
                          to={`/products?categoryId=${category.id}`}
                          className="group flex flex-col items-center justify-center w-[calc(50%-0.625rem)] sm:w-56 h-44 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border border-pink-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <span className="p-3.5 mb-3 bg-white rounded-full shadow-md group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300">
                            <Icon className="w-6 h-6 text-pink-500 group-hover:text-white transition-colors" />
                          </span>
                          <span className="font-bold text-gray-800">{category.name}</span>
                          <span className="mt-1 text-xs font-medium text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            Shop now <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </Link>
                      </Motion.div>
                    );
                  })}
            </div>
          </Motion.div>
        </section>
      )}

      {/* Featured Products Section */}
      {(productsLoading || featuredProducts.length > 0) && (
        <section className="bg-pink-50 py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Motion.div
              {...fadeUp}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
            >
              <div>
                <span className="inline-flex items-center px-4 py-1.5 bg-white border border-pink-100 rounded-full text-pink-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                  <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Handpicked For You
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900">Featured Blooms</h2>
                <p className="text-gray-500 mt-3 max-w-xl">
                  Our most-loved arrangements, ready to make someone smile today
                </p>
              </div>
              <Link
                to="/products"
                className="group inline-flex items-center self-start px-6 py-2.5 bg-white border border-pink-200 text-pink-600 rounded-full font-semibold shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300"
              >
                View All Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductCard key={i} loading />)
                : featuredProducts.map((product, index) => (
                    <Motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        discountPrice={product.discountPrice}
                        stock={product.stock}
                        image={`/uploads/${product.imageUrl}`}
                        onQuickView={() => setSelectedProduct(product)}
                      />
                    </Motion.div>
                  ))}
            </div>
          </div>

          <ProductDetailModal
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
          />
        </section>
      )}

      {/* Active Offers Strip */}
      {isAuthenticated && validCoupons.length > 0 && (
        <section className="bg-white py-10 px-4 sm:px-6">
          <Motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 shadow-2xl"
          >
            <Flower2 className="absolute -right-6 -top-6 w-40 h-40 text-white/10 rotate-12" />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4 shrink-0">
                <span className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <Gift className="w-7 h-7 text-white" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">Active Offers</h3>
                  <p className="text-white/80 text-sm">Tap a code to copy & apply at checkout</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:ml-auto">
                {validCoupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => handleCopyCoupon(coupon)}
                    className="group flex items-center gap-3 pl-4 pr-2 py-2 bg-white/15 backdrop-blur-sm border border-dashed border-white/40 rounded-xl hover:bg-white/25 transition-all duration-300"
                  >
                    <span className="text-left">
                      <span className="block font-mono font-bold tracking-widest text-white uppercase text-sm">
                        {coupon.code}
                      </span>
                      <span className="block text-xs text-white/80">${Number(coupon.amount).toFixed(2)} off your order</span>
                    </span>
                    <span className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      {copiedCouponId === coupon.id ? (
                        <Check className="w-4 h-4 text-emerald-200" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Motion.div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="relative bg-gradient-to-b from-black via-purple-950/40 to-black py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />
        <Motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-pink-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200">
              Petals With a Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="inline-flex p-3.5 mb-5 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </section>

      {/* About Teaser Section */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={flowerImg}
              alt="Fresh flower arrangement"
              className="w-full h-[420px] object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-5 -right-5 hidden sm:block px-6 py-4 bg-white rounded-2xl shadow-xl border border-pink-100">
              <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">10+ Years</p>
              <p className="text-xs text-gray-500 font-medium">of floral craftsmanship</p>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 bg-pink-50 border border-pink-100 rounded-full text-pink-600 text-xs font-semibold uppercase tracking-wider mb-4">
              <Flower2 className="w-3.5 h-3.5 mr-1.5" />
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Where Every Bloom Tells a Story
            </h2>
            <p className="text-gray-500 mt-5 leading-relaxed">
              What began as a small family garden has blossomed into the citys most trusted florist.
              We believe flowers are more than gifts — they are emotions made visible.
            </p>

            <ul className="mt-6 space-y-3">
              {['100% freshness guarantee', 'Handcrafted by expert florists', 'Eco-friendly packaging'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <span className="p-1 bg-emerald-50 rounded-full">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    {item}
                  </li>
                )
              )}
            </ul>

            <Link
              to="/about-us"
              className="group mt-8 inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-xl hover:shadow-pink-500/25 transition-all duration-300 font-semibold"
            >
              Discover More
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-pink-50 py-20 px-4 sm:px-6">
        <Motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center px-4 py-1.5 bg-white border border-pink-100 rounded-full text-pink-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Quote className="w-3.5 h-3.5 mr-1.5" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Loved by Our Customers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-pink-100" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full text-white font-bold text-sm shadow-md">
                    {testimonial.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black py-20 px-4 sm:px-6">
        <Motion.div
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-pink-900 to-purple-950 p-10 md:p-14 text-center shadow-2xl border border-white/10"
        >
          <Flower2 className="absolute -left-8 -bottom-8 w-36 h-36 text-white/5 -rotate-12" />
          <Send className="absolute -right-6 -top-6 w-28 h-28 text-white/5 rotate-12" />

          <div className="relative">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-pink-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Newsletter
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200">
              Get Fresh Deals in Your Inbox
            </h2>
            <p className="text-white/70 mt-3 mb-8">
              Seasonal collections, exclusive offers and floral care tips — no spam, ever.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-7 py-3 bg-white text-purple-700 rounded-full font-bold text-sm hover:bg-pink-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-lg"
              >
                Subscribe
                <Send className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div>
        </Motion.div>
      </section>
    </div>
  );
};

export default Home;
