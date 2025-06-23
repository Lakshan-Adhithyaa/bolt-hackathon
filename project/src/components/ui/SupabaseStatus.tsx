import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export const SupabaseStatus: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setIsConfigured(!!(supabaseUrl && supabaseKey));
  }, []);

  if (isConfigured) {
    return null; // Don't show anything if Supabase is properly configured
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">Demo Mode</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Supabase not configured. Using local storage for demo.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSetup(!showSetup)}
                className="mt-2 text-yellow-700 hover:text-yellow-800"
              >
                <Settings className="w-4 h-4 mr-1" />
                Setup Guide
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showSetup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-yellow-200"
              >
                <div className="space-y-3 text-sm text-yellow-800">
                  <div>
                    <h5 className="font-medium">To enable full functionality:</h5>
                    <ol className="list-decimal list-inside space-y-1 mt-2 text-xs">
                      <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                      <li>Copy your project URL and anon key</li>
                      <li>Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file with:</li>
                    </ol>
                    <div className="mt-2 p-2 bg-yellow-100 rounded text-xs font-mono">
                      VITE_SUPABASE_URL=your_url<br/>
                      VITE_SUPABASE_ANON_KEY=your_key
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs">Account creation works in demo mode</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};