import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profession: string;
  rememberMe: boolean;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    rememberMe: false,
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };
  
  const getPasswordStrength = (password: string): { strength: number; message: string } => {
    if (!password) return { strength: 0, message: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const messages = [
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ];
    
    return {
      strength,
      message: messages[strength - 1] || ''
    };
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to appropriate page on success
      if (mode === 'signup') {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = () => {
    // Implement Google authentication
    console.log('Google auth clicked');
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Start your journey to mastering the skills for your dream career
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
          {/* Auth Mode Toggle */}
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mb-6"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName\" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.fullName
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.email
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 rounded-lg border ${
                    errors.password
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
              {mode === 'signup' && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-600 mr-3">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                          passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/4' :
                          passwordStrength.strength === 3 ? 'bg-green-500 w-3/4' :
                          passwordStrength.strength === 4 ? 'bg-green-600 w-full' :
                          ''
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {passwordStrength.message}
                    </span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                    <li className="flex items-center">
                      {formData.password.length >= 8 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-slate-400 mr-1" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-slate-400 mr-1" />
                      )}
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-slate-400 mr-1" />
                      )}
                      One number
                    </li>
                    <li className="flex items-center">
                      {/[^A-Za-z0-9]/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-slate-400 mr-1" />
                      )}
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-2 rounded-lg border ${
                        errors.confirmPassword
                          ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Goal or Profession (Optional)
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="e.g., Web Developer, Data Scientist"
                  />
                </div>
              </>
            )}
            
            {mode === 'login' ? (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
