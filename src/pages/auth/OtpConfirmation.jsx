import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVerifyOtpMutation } from '../../features/auth/authApi'; // Make sure this import is correct

const OtpConfirmation = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputsRef = useRef([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    const email = localStorage.getItem('registeredEmail') || null;

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        const { key } = e;

        if (key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
            } else if (index > 0) {
                newOtp[index - 1] = '';
                inputsRef.current[index - 1].focus();
            }

            setOtp(newOtp);
        }

        if (key === 'ArrowLeft' && index > 0) {
            inputsRef.current[index - 1].focus();
        }

        if (key === 'ArrowRight' && index < otp.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];

        paste.forEach((char, i) => {
            if (i < 6 && /^[0-9]$/.test(char)) {
                newOtp[i] = char;
                if (inputsRef.current[i]) {
                    inputsRef.current[i].value = char;
                }
            }
        });

        setOtp(newOtp);

        const firstEmptyIndex = newOtp.findIndex((digit) => !digit);
        if (firstEmptyIndex !== -1 && inputsRef.current[firstEmptyIndex]) {
            inputsRef.current[firstEmptyIndex].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const finalOtp = otp.join('');

        try {
            await verifyOtp({ email, finalOtp }).unwrap();
            navigate('/login', {
                replace: true,
                state: { otpSuccess: 'OTP verified successfully. Please log in.' },
            });
        } catch (err) {
            setErrors({
                general:
                    err?.data?.message || 'OTP verification failed. Please try again.',
            });
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter 6-digit Code</h2>
                    <p className="text-gray-600 text-sm">We sent a code to your email. Please enter it below.</p>
                </div>

                <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-6">
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        ))}
                    </div>

                    {errors.general && (
                        <p className="text-red-600 text-sm text-center animate-shake">{errors.general}</p>
                    )}

                    <button
                        type="submit"
                        disabled={otp.includes('') || isLoading}
                        className={`w-full py-2 px-4 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2
                            ${otp.includes('') || isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    ></path>
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            'Confirm OTP'
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 pt-4">
                    <p>Didn’t get a code? <button type="button" className="text-blue-600 hover:underline">Resend</button></p>
                </div>
            </div>
        </div>
    );
};

export default OtpConfirmation;
