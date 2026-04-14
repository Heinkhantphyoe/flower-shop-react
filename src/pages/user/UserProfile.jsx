import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Eye, EyeOff, MapPin } from 'lucide-react';
import { useGetMeQuery, useUpdateMeMutation } from '../../api/authApi';
import { useState } from 'react';

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

export default function UserProfile() {
    const { data: userResponse, isLoading, error } = useGetMeQuery();
    const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
    const [message, setMessage] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = userResponse?.data || {};

    const initialName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const initialPhone = user.phoneNumber || user.phone || "";
    const initialAddress = user.address || "";

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Failed to load profile.</div>;

    const handleFormChange = (e) => {
        const formTarget = e.currentTarget;
        const nameNode = formTarget.elements.namedItem('name');
        const phoneNode = formTarget.elements.namedItem('phone');
        const addressNode = formTarget.elements.namedItem('address');
        const passwordNode = formTarget.elements.namedItem('password');
        const avatarNode = formTarget.elements.namedItem('avatar');

        if (e.target.name === 'avatar' && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPreviewImage(URL.createObjectURL(file));
        }
        
        const currentName = nameNode?.value?.trim() || '';
        const currentPhone = phoneNode?.value?.trim() || '';
        const currentAddress = addressNode?.value?.trim() || '';
        const currentPassword = passwordNode?.value?.trim() || '';
        const currentAvatar = avatarNode?.files?.length > 0;

        if (
            currentName !== initialName || 
            currentPhone !== initialPhone || 
            currentAddress !== initialAddress || 
            currentPassword !== '' || 
            currentAvatar
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        const formTarget = e.target;
        const formData = new FormData(formTarget);
        
        const name = formData.get('name')?.trim();
        const phone = formData.get('phone')?.trim();
        const address = formData.get('address')?.trim();
        const password = formData.get('password')?.trim();
        const confirmPassword = formData.get('confirmPassword')?.trim();

        if ((password || confirmPassword) && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        const payload = new FormData();
        if (name) payload.append('name', name);
        if (phone) payload.append('phoneNumber', phone);
        if (address) payload.append('address', address);
        if (password) {
            payload.append('password', password);
            payload.append('confirmPassword', confirmPassword);
        }
        
        const avatarFile = formTarget.elements.namedItem('avatar')?.files?.[0];
        if (avatarFile) {
            payload.append('profileImage', avatarFile); 
        }

        try {
            await updateMe(payload).unwrap();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            e.target.password.value = '';
            e.target.confirmPassword.value = '';
            setHasChanges(false);
        } catch (err) {
            setMessage({ type: 'error', text: err?.data?.message || err.message || 'Failed to update profile' });
        }
    };

    return (
    <motion.div 
        className="space-y-8 p-4 md:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <div className="flex justify-between items-center">
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-pink-500">
                My Profile
            </motion.h1>
            {message && (
                <div className={`px-4 py-2 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
        </div>

        <form onSubmit={handleSubmit} onChange={handleFormChange} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                    {(previewImage || user.profileImage || user.profileImageUrl || user.avatar?.url) ? (
                        <img
                            src={previewImage || (user.profileImageUrl ? `/uploads/${user.profileImageUrl}` : null) || (user.profileImage ? `/uploads/${user.profileImage}` : null) || user.avatar?.url}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-pink-100"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full border-4 border-pink-100 bg-gray-50 flex items-center justify-center text-gray-400 text-sm text-center">
                            Upload Image
                        </div>
                    )}
                    <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
                        <Camera size={16} />
                        <input type="file" id="avatar" name="avatar" className="hidden" />
                    </label>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="mt-2 text-sm bg-pink-50 text-pink-600 font-semibold px-3 py-1 rounded-full capitalize">{user.role || 'user'}</p>
            </motion.div>

            {/* Right Column: Details Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <User size={20} className="mr-2 text-pink-500" /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" defaultValue={user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
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
                                <input type="email" name="email" defaultValue={user.email} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" name="phone" defaultValue={user.phoneNumber || user.phone || ""} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MapPin size={20} className="mr-2 text-pink-500" /> Address Details
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea name="address" defaultValue={user.address || ""} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"></textarea>
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
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="••••••••" 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="confirmPassword" 
                                        placeholder="••••••••" 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-10 flex justify-end">
                    <motion.button 
                        type="submit"
                        disabled={isUpdating || !hasChanges}
                        className={`px-6 py-2.5 rounded-lg shadow-md transition-colors ${
                            isUpdating || !hasChanges 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-pink-500 text-white hover:bg-pink-600'
                        }`}
                        whileHover={{ scale: isUpdating || !hasChanges ? 1 : 1.05 }}
                        whileTap={{ scale: isUpdating || !hasChanges ? 1 : 0.95 }}
                    >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </div>
            </motion.div>
        </form>
    </motion.div>
    );
}
