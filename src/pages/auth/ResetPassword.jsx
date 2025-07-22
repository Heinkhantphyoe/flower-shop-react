import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, verifyResetToken } from '../../features/auth/AuthSlice';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') || null;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const [isTokenValid, setIsTokenValid] = useState(null); // null = loading, true = valid, false = invalid
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Step 1: Verify Token on Mount
    useEffect(() => {
        const verifyToken = async () => {
            const result = await dispatch(verifyResetToken({ token }));
            if (verifyResetToken.fulfilled.match(result)) {
                setIsTokenValid(true);
            } else {
                setIsTokenValid(false);
            }
        };
        verifyToken();
    }, [dispatch, token]);

    // Step 2: Submit New Password
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setErrors({ general: 'Passwords do not match' });
        }

        const result = await dispatch(resetPassword({ token, newPassword: password }));
        if (resetPassword.fulfilled.match(result)) {
            navigate('/login', {
                replace: true,
                state: { resetPassSuccess: 'Password reset successfully.Login with new Password' }
            });
        } else {
            setErrors({ general: result.payload || 'Reset failed' });
        }
    };

    if (isTokenValid === null) {
        return <p className="text-center mt-20 text-gray-600">Verifying token...</p>;
    }

    if (isTokenValid === false) {
        return (
            <div className="text-center mt-20 text-red-600 font-semibold">
                Invalid or expired reset link.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <p className="text-sm text-red-500 text-center">{errors.general}</p>
                    )}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />  }
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
