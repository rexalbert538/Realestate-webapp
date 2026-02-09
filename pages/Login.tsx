import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden font-display">
      {/* Left Side: Image Pane */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900">
        <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjhzjTbSDPohpqg73W3iMOkrmWe6r3kEUfVOFEW2C01GQu77W6TSS5vuXF4pUKTnlfhxPW5K9UNTLoIZPCw7BTqT7gy3nzOZ-p8kzvrEIKZLO--Is8p3WzCitlGW8pM7Y9MyxvcyO0nn3h7Mgmh1CKJxkr26pDxKDism8JvnX19BOAvV7iBM6OE2ttgv9yAoHqtiGoA-Ekf0LaPZ0vNagd1Mcuz8AxDs4AfD07QLm2m2hlAyCPTxOsTwh2b6agcKV4ikovx6AAmw" 
            alt="Modern luxury home" 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-icons-round text-white">apartment</span>
            </div>
            <span className="text-xl font-bold tracking-tight">EstateAdmin</span>
          </div>
          <div className="max-w-md space-y-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary/30 backdrop-blur-sm border border-primary/40 rounded-full text-xs font-medium text-white">Latest Property</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Manage your portfolio with precision and style.</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Access real-time analytics, manage agent profiles, and oversee property listings from a single, powerful dashboard.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-background-dark transition-colors duration-300">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter your details to access the dashboard.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <span className="material-icons-round text-sm">error</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">Email address</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-round text-gray-400 text-xl">mail_outline</span>
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 sm:text-sm" 
                    placeholder="name@company.com" 
                    required 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-blue-600 transition-colors">Forgot password?</a>
                  </div>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-round text-gray-400 text-xl">lock_outline</span>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 sm:text-sm" 
                    placeholder="••••••••" 
                    required 
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer group"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-icons-round text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 text-xl">
                        {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">Remember me for 30 days</label>
            </div>
            <div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an admin account? <Link to="/register" className="font-medium text-primary hover:text-blue-500 transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;