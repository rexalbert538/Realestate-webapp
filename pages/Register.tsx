import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden font-display">
       {/* Left Side: Image / Hero */}
       <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNPt-bVjvWaKBYFU-m3ondZP6RWGV_zXkjZOLqWmTEmgqhTgMQS5e0sJrvMHLkKX-DFve6eO5GQ0_DzkyeFtCX3j5NEDZqFnJpVf0HLk2av4xgc_MnuxiKdlellEfnZxsgT-SOyxO4MJIfR1_VaZzJSkEcxafQBhy-f_ofk1ZX3X8iU1pSzAfYAOjkzXHAKQmckfcPKCL4jivi2fX5gaS-ETYSQoR3G7Elo0FRDTgDeqN0SMFBpQTklnUQwlMPGuQMxRLUXreWJw')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-12 text-white">
             <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                   <span className="material-icons-round text-primary text-4xl">apartment</span>
                   <span className="text-2xl font-bold tracking-tight">EstateAdmin</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 leading-tight">Empower your agency with smarter management tools.</h1>
                <p className="text-slate-300 text-lg max-w-md">Join thousands of top-tier agents managing listings, clients, and closings from a single dashboard.</p>
             </div>
             <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgFg4o0MfbWisZILkJd0blHX6zraqExuqaA7qy9idUTy8wvBBNdeinhTOVZt_6ZxE_G7wJx4Mo770Dcwu3CZc_4gKGp2WxTzQwcnmV7R1zp4mcfg0P5oMooAjBUB5DN-cJWpS624xitQaubMGUvxQll5pfyBeTXTiMjHSAeUFujYdtTz1doUoz7N0WaxWN82Vp3SdGLTCcbxvF2cKQknf79-EvTIWbGCXDpFxcQkE4JvH3Ijg3jo7OpHj_ftrh22I9oPpq8IaoDQ" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" />
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArSYyDKdKEkK9jcgNtuEEHK28t1UabgEyg5xFh12mnw9E1Ytbytmlx7M15kgbJzJjze78ueG7JN61TjkW7GsF9R35pySVYj4St9maLAqAE3niIxWzPayEE7ClACgo-eq7Jcb2iNptNcJ7pSc3yLNgpSIh0DZJQcooWuXDkU2R9ekggXOOurbgHmaMmv-unOAwkZgOcnMl8ckychAOgpi85nnrzzbUvU6t1QpxUYgnQG8TCrgvvT2imKbaMN4C4p9op7asneTjcng" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" />
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqnO16v2SM4xvhC6_pd6plJddmShMNO4yGY_FYzR-3rO6nikfuq5X_rmIYyIoXp81DLGjtJBQLd33Af7BONAmonBYHZU9uvd2FIDqwNN2lfrn2yh-iB8FG8ndtieB6eROMRVsC_Y0VuecVTsyDlmSyP8IuclcPkoj95VNYKHsEGaWAHjNeit6mpGI1v5-y7z67oVu55V8JpQKi984peHkDy6U6GPXHhjIo0fnxfLZLR3uQ2xcd5W_-qArITN_yleFs72flGPV_OQ" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
                <div className="text-sm font-medium">
                   <span className="block">Trusted by 10,000+ agents</span>
                   <div className="flex text-yellow-400 text-xs">
                      <span className="material-icons-round text-sm">star</span>
                      <span className="material-icons-round text-sm">star</span>
                      <span className="material-icons-round text-sm">star</span>
                      <span className="material-icons-round text-sm">star</span>
                      <span className="material-icons-round text-sm">star</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Right Side: Registration Form */}
       <div className="w-full md:w-1/2 h-full overflow-y-auto bg-white dark:bg-slate-900 flex flex-col justify-center py-10 px-6 sm:px-12 lg:px-24">
          <div className="w-full max-w-md mx-auto">
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an account</h2>
                <p className="text-slate-500 dark:text-slate-400">Start managing your property portfolio today.</p>
             </div>

             {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                  <span className="material-icons-round text-sm">error</span>
                  {error}
                </div>
              )}

             <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="material-icons-round text-slate-400 text-xl">person_outline</span>
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins" 
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-white" 
                        required 
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agency Name</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="material-icons-round text-slate-400 text-xl">business</span>
                      </div>
                      <input type="text" placeholder="e.g. Prestige Properties" className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-white" />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="material-icons-round text-slate-400 text-xl">mail_outline</span>
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com" 
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-white" 
                        required 
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Create Password</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="material-icons-round text-slate-400 text-xl">lock_outline</span>
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-white" 
                        required 
                      />
                      <div 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                         <span className="material-icons-round text-slate-400 text-xl hover:text-slate-600 dark:hover:text-slate-300">
                             {showPassword ? 'visibility' : 'visibility_off'}
                         </span>
                      </div>
                   </div>
                   <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters</p>
                </div>
                <div className="flex items-start">
                   <div className="flex items-center h-5">
                      <input id="terms" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700" required />
                   </div>
                   <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-slate-700 dark:text-slate-300">I agree to the <a href="#" className="text-primary hover:text-blue-600 underline decoration-primary/30 underline-offset-2">Terms and Conditions</a> and <a href="#" className="text-primary hover:text-blue-600 underline decoration-primary/30 underline-offset-2">Privacy Policy</a></label>
                   </div>
                </div>
                <div>
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                   </button>
                </div>
             </form>
             <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                   Already have an account? <Link to="/login" className="font-medium text-primary hover:text-blue-500 transition-colors">Log in</Link>
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Register;