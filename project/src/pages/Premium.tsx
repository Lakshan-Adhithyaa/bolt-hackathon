import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Shield, 
  Headphones, 
  BarChart3, 
  Globe, 
  Download,
  Star,
  CreditCard,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  interval: 'month' | 'year';
  popular?: boolean;
  features: string[];
  tokenAllowance: number;
  maxRoadmaps: number;
  offlineAccess: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  exclusiveContent: boolean;
}

export const Premium: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple' | 'google'>('card');

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      originalPrice: billingCycle === 'yearly' ? 119.88 : undefined,
      interval: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        '5,000 tokens per month',
        'Up to 20 roadmaps',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        'Standard video quality'
      ],
      tokenAllowance: 5000,
      maxRoadmaps: 20,
      offlineAccess: false,
      prioritySupport: false,
      advancedAnalytics: false,
      exclusiveContent: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 19.99 : 199.99,
      originalPrice: billingCycle === 'yearly' ? 239.88 : undefined,
      interval: billingCycle === 'monthly' ? 'month' : 'year',
      popular: true,
      features: [
        '15,000 tokens per month',
        'Unlimited roadmaps',
        'Advanced analytics',
        'Priority support',
        'Offline access',
        'HD video quality',
        'Exclusive content',
        'Custom learning paths'
      ],
      tokenAllowance: 15000,
      maxRoadmaps: -1,
      offlineAccess: true,
      prioritySupport: true,
      advancedAnalytics: true,
      exclusiveContent: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 39.99 : 399.99,
      originalPrice: billingCycle === 'yearly' ? 479.88 : undefined,
      interval: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        'Unlimited tokens',
        'Unlimited roadmaps',
        'Advanced analytics',
        '24/7 priority support',
        'Offline access',
        '4K video quality',
        'Exclusive content',
        'Custom learning paths',
        'Team collaboration',
        'API access',
        'White-label options'
      ],
      tokenAllowance: -1,
      maxRoadmaps: -1,
      offlineAccess: true,
      prioritySupport: true,
      advancedAnalytics: true,
      exclusiveContent: true,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateUser({ isPremium: true });
      
      addToast({
        type: 'success',
        title: 'Welcome to Premium!',
        message: `You've successfully subscribed to the ${plan.name} plan.`,
      });
      
      setShowCheckout(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Payment Failed',
        message: 'There was an issue processing your payment. Please try again.',
      });
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Unlimited Tokens',
      description: 'Generate as many roadmaps as you need without token limits',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights into your learning progress and performance',
    },
    {
      icon: Download,
      title: 'Offline Access',
      description: 'Download content for learning without internet connection',
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: '24/7 premium support with faster response times',
    },
    {
      icon: Globe,
      title: 'Exclusive Content',
      description: 'Access to premium courses and expert-curated content',
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Enhanced security features and data protection',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Learning Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your learning journey with premium features and unlimited access.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`p-8 h-full relative overflow-hidden ${
                plan.popular ? 'border-purple-300 shadow-lg' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
                )}
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.interval}</span>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${plan.originalPrice}/{plan.interval}
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + featureIndex * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        : ''
                    }`}
                    variant={plan.popular ? 'primary' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {user?.isPremium ? 'Current Plan' : 'Get Started'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-gray-600">
              Premium features designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckout && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Complete Your Purchase
                </h3>
                
                {(() => {
                  const plan = plans.find(p => p.id === selectedPlan);
                  return plan ? (
                    <div className="mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-900">{plan.name} Plan</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          ${plan.price}/{plan.interval}
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <h5 className="font-medium text-gray-900">Payment Method</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'card', icon: CreditCard, label: 'Card' },
                            { id: 'paypal', icon: Globe, label: 'PayPal' },
                            { id: 'apple', icon: Smartphone, label: 'Apple Pay' },
                            { id: 'google', icon: Smartphone, label: 'Google Pay' },
                          ].map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as any)}
                              className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                                paymentMethod === method.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <method.icon className="w-4 h-4" />
                              <span className="text-sm">{method.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setShowCheckout(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCheckout}>
                          Complete Purchase
                        </Button>
                      </div>
                    </div>
                  ) : null;
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};