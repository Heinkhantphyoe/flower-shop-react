import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera } from 'lucide-react';

// Animation variants for staggered effect
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function Profile() {
    return (
    <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-800">
            Profile Settings
        </motion.h1>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                    <img
                        src="https://i.pravatar.cc/150?u=admin-user"
                        alt="Admin Avatar"
                        className="w-full h-full rounded-full object-cover border-4 border-pink-100"
                    />
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
                        <Camera size={16} />
                        <input type="file" id="avatar-upload" className="hidden" />
                    </label>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Admin User</h2>
                <p className="text-gray-500">admin@flowerstore.com</p>
                <p className="mt-2 text-sm bg-pink-50 text-pink-600 font-semibold px-3 py-1 rounded-full">Administrator</p>
            </motion.div>

            {/* Right Column: Details Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <User size={20} className="mr-2 text-pink-500" /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" defaultValue="User" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Mail size={20} className="mr-2 text-pink-500" /> Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" defaultValue="admin@flowerstore.com" disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Shield size={20} className="mr-2 text-pink-500" /> Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-10 flex justify-end">
                    <motion.button 
                        type="submit"
                        className="bg-pink-500 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-pink-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Save Changes
                    </motion.button>
                </div>
            </motion.div>
        </form>
    </motion.div>
    );
}