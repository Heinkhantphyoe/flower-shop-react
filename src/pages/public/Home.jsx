import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Star, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import  bg1  from "../../assets/images/bg1.avif"
import  bg2  from "../../assets/images/bg2.avif"
import  bg3  from "../../assets/images/bg3.jpg"


const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forgotPassSuccess, loginSuccess } = location.state || {};
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroSlides = [
    {
      title: "Brighten Their Day",
      subtitle: "with Premium Blooms",
      image: bg1 ,
      accent: "Handpicked • Fresh • Beautiful"
    },
    {
      title: "Express Your Love",
      subtitle: "through Nature's Art",
      image:  bg2 ,
      accent: "Romantic • Elegant • Timeless"
    },
    {
      title: "Celebrate Every Moment",
      subtitle: "with Perfect Arrangements",
      image:  bg3 ,
      accent: "Special • Memorable • Stunning"
    }
  ];




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



  return (
    <div className="font-sans text-gray-800 bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              {heroSlides[currentSlide].accent}
            </motion.div>

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
                to="/shop"
                className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 text-lg font-semibold"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-lg font-medium">
                <Flower2 className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Learn More
              </button>
            </div>
          </motion.div>
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
    </div>
  );
};

export default Home;
