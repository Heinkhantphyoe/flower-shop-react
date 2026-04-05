import React from 'react';
import { Leaf, Smile, Flower2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-pink-50 via-purple-50 to-green-50 flex items-center justify-center px-4 mt-24 md:mt-0">
      <div className="max-w-4xl bg-white shadow-xl rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-6">
          About <span className="text-pink-500">GIFTORA</span>
        </h1>

        <p className="text-gray-600 text-center mb-6">
          At <strong>Giftora</strong>, we believe flowers aren't just plants—they're messages.
          Whether it's love, joy, sympathy, or celebration, our blooms speak from the heart.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center text-center">
            <Flower2 className="text-pink-500 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-green-700">Fresh & Local</h3>
            <p className="text-sm text-gray-600">
              Our flowers are sourced daily from trusted local growers to ensure the freshest bouquets.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Smile className="text-yellow-500 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-green-700">Customer First</h3>
            <p className="text-sm text-gray-600">
              We're committed to making your floral experience delightful, from order to doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Leaf className="text-green-500 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-green-700">Eco Friendly</h3>
            <p className="text-sm text-gray-600">
              We use sustainable packaging and support eco-conscious farming practices.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            From birthday blooms to wedding florals, we're here to make your special moments unforgettable.
          </p>
          <p className="text-pink-500 font-semibold mt-2">
            Thank you for choosing Giftora.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
