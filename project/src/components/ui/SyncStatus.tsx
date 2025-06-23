import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncStatusProps {
  isOnline?: boolean;
  isSyncing?: boolean;
  lastSync?: Date;
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  isOnline = true,
  isSyncing = false,
  lastSync,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }
    
    if (isSyncing) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-4 h-4 text-blue-500" />
        </motion.div>
      );
    }

    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    return 'Synced';
  };

  const getLastSyncText = () => {
    if (!lastSync) return 'Never synced';
    
    const now = new Date();
    const diff = now.getTime() - lastSync.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </motion.button>

      {/* Details tooltip */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-48 z-50"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last sync:</span>
              <span className="text-sm font-medium">{getLastSyncText()}</span>
            </div>

            {!isOnline && (
              <div className="flex items-start space-x-2 pt-2 border-t border-gray-100">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600">
                  You're offline. Changes will sync when connection is restored.
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};