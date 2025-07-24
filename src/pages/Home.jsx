import { useEffect, useState } from 'react';
// Mock Link component for demo - replace with your router Link
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

// Mock hooks for demo - replace with your router hooks
const useLocation = () => ({ state: {} });
const useNavigate = () => () => {};
import { toast } from 'react-toastify';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flower2, Truck, ThumbsUp, Smile, Star, ArrowRight, Sparkles, Heart, Gift } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forgotPassSuccess } = location.state || {};
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroSlides = [
    {
      title: "Brighten Their Day",
      subtitle: "with Premium Blooms",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      accent: "Handpicked • Fresh • Beautiful"
    },
    {
      title: "Express Your Love",
      subtitle: "through Nature's Art",
      image: "https://images.unsplash.com/photo-1606041011872-596597976b25",
      accent: "Romantic • Elegant • Timeless"
    },
    {
      title: "Celebrate Every Moment",
      subtitle: "with Perfect Arrangements",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd",
      accent: "Special • Memorable • Stunning"
    }
  ];

  useEffect(() => {
    const showToastIfExists = (message) => {
      if (message) toast.success(message);
    };

    showToastIfExists(forgotPassSuccess);
    if (forgotPassSuccess) {
      navigate(location.pathname, { replace: true });
    }

    setIsLoaded(true);

    // Auto-slide carousel
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [forgotPassSuccess, location.pathname, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation controls for sections
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } 
    },
    hover: { 
      y: -10,
      rotateX: 5,
      scale: 1.02,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-black overflow-hidden">
      {/* Cursor Trail Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroSlides[currentSlide].image}')` }}
          />
        </AnimatePresence>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-pink-900/40" />
        
        {/* Floating Elements */}
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-20 text-pink-300/30">
          <Heart className="w-8 h-8" />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-32 right-32 text-violet-300/30" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-32 text-pink-300/30" style={{ animationDelay: '2s' }}>
          <Gift className="w-10 h-10" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-4xl"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              {heroSlides[currentSlide].accent}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200 tracking-tight leading-tight"
              >
                {heroSlides[currentSlide].title}
                <br />
                <span className="text-4xl md:text-6xl">{heroSlides[currentSlide].subtitle}</span>
              </motion.h1>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/80 mt-6 text-xl md:text-2xl font-light max-w-2xl mx-auto"
            >
              Experience luxury floral arrangements crafted with passion and delivered with care
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/shop"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-500 transform hover:scale-105 text-lg font-semibold overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <button className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-lg font-medium">
                <Flower2 className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-32 bg-gradient-to-br from-gray-50 via-pink-50/50 to-violet-50/50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ec4899 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-pink-600 to-violet-600 mb-6">
              Featured Bouquets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium floral arrangements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Rose Delight', 
                price: '$39.99', 
                originalPrice: '$49.99',
                img: 'https://images.unsplash.com/photo-1585155775098-5e835c943d77',
                rating: 4.9,
                reviews: 127,
                badge: 'Bestseller'
              },
              { 
                name: 'Sunshine Mix', 
                price: '$29.99', 
                originalPrice: '$39.99',
                img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6',
                rating: 4.8,
                reviews: 89,
                badge: 'Limited'
              },
              { 
                name: 'Elegant Lilies', 
                price: '$49.99', 
                originalPrice: '$59.99',
                img: 'https://images.unsplash.com/photo-1600172454520-0b7c1e7b8c70',
                rating: 5.0,
                reviews: 203,
                badge: 'Premium'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 shadow-xl"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                    item.badge === 'Bestseller' ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                    item.badge === 'Limited' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                    'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                {/* Heart Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>

                <div className="relative overflow-hidden">
                  <motion.img 
                    src={item.img} 
                    alt={item.name} 
                    className="h-80 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-8">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star 
                        key={starIndex}
                        className={`w-4 h-4 ${starIndex < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({item.reviews})</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                      {item.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">{item.originalPrice}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-pink-900/10 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-16">
              We're committed to delivering excellence in every arrangement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: <Truck className="w-16 h-16" />, 
                label: 'Free Delivery',
                desc: 'Same-day delivery available',
                gradient: 'from-blue-400 to-cyan-400'
              },
              { 
                icon: <ThumbsUp className="w-16 h-16" />, 
                label: 'Top Quality',
                desc: 'Premium fresh flowers only',
                gradient: 'from-green-400 to-emerald-400'
              },
              { 
                icon: <Flower2 className="w-16 h-16" />, 
                label: 'Fresh Flowers',
                desc: 'Daily sourced arrangements',
                gradient: 'from-pink-400 to-rose-400'
              },
              { 
                icon: <Smile className="w-16 h-16" />, 
                label: 'Happy Customers',
                desc: '99% satisfaction rate',
                gradient: 'from-yellow-400 to-orange-400'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  rotateY: 5,
                }}
                className="group p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:bg-white/20 transition-all duration-500"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.label}</h3>
                <p className="text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-32 bg-gradient-to-br from-pink-50 via-white to-violet-50 relative"
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-pink-600 to-violet-600 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
              Real stories from our satisfied customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { 
                name: 'Sarah M.', 
                feedback: 'Absolutely stunning flowers! The arrangement exceeded my expectations and the delivery was perfectly timed. Will definitely order again!',
                rating: 5,
                location: 'New York',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150'
              },
              { 
                name: 'James K.', 
                feedback: 'Ordered for my anniversary and my wife was thrilled! The quality and freshness of the flowers were exceptional. Highly recommended!',
                rating: 5,
                location: 'California',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                    <p className="text-gray-600">{review.location}</p>
                    <div className="flex mt-1">
                      {[...Array(review.rating)].map((_, starIndex) => (
                        <Star key={starIndex} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed italic">"{review.feedback}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-24 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-center relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full"
        />

        <div className="relative z-10">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Send Some Love?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Browse our premium collection and make someone's day extraordinary
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center px-12 py-5 bg-white text-purple-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25"
            >
              <Sparkles className="mr-3 w-6 h-6" />
              Browse Flowers
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;