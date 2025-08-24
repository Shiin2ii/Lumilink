/**
 * API Test Panel - Development only
 * Test API endpoints and functionality
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// API Test utilities
import {
  testAnalyticsApi,
  testLinksApi,
  testBadgesApi,
  testPremiumApi,
  runAllApiTests,
  testApiConnectivity,
  testAuthentication
} from '../../utils/apiTest';

const ApiTestPanel = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const tests = [
    {
      id: 'connectivity',
      name: 'API Connectivity',
      description: 'Test basic API connection',
      function: testApiConnectivity,
      color: 'blue'
    },
    {
      id: 'auth',
      name: 'Authentication',
      description: 'Check authentication token',
      function: testAuthentication,
      color: 'green'
    },
    {
      id: 'analytics',
      name: 'Analytics API',
      description: 'Test analytics endpoints',
      function: testAnalyticsApi,
      color: 'purple'
    },
    {
      id: 'links',
      name: 'Links API',
      description: 'Test links management',
      function: testLinksApi,
      color: 'indigo'
    },
    {
      id: 'badges',
      name: 'Badges API',
      description: 'Test badge system',
      function: testBadgesApi,
      color: 'amber'
    },
    {
      id: 'premium',
      name: 'Premium API',
      description: 'Test premium features',
      function: testPremiumApi,
      color: 'pink'
    }
  ];

  const runTest = async (test) => {
    setIsRunning(true);
    setSelectedTest(test.id);
    
    try {
      const startTime = Date.now();
      const result = await test.function();
      const endTime = Date.now();
      
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          ...result,
          duration: endTime - startTime,
          timestamp: new Date().toISOString()
        }
      }));
      
      if (result.success) {
        toast.success(`${test.name} test passed`);
      } else {
        toast.error(`${test.name} test failed`);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
      toast.error(`${test.name} test error`);
    } finally {
      setIsRunning(false);
      setSelectedTest(null);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      const { allPassed, results } = await runAllApiTests();
      
      // Convert results to our format
      const formattedResults = {};
      Object.entries(results).forEach(([key, result]) => {
        formattedResults[key] = {
          ...result,
          timestamp: new Date().toISOString()
        };
      });
      
      setTestResults(formattedResults);
      
      if (allPassed) {
        toast.success('All API tests passed!');
      } else {
        toast.error('Some API tests failed');
      }
    } catch (error) {
      toast.error('Failed to run all tests');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (result) => {
    if (!result) return <ClockIcon className="w-5 h-5 text-gray-400" />;
    if (result.success) return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    return <XCircleIcon className="w-5 h-5 text-red-400" />;
  };

  const getStatusColor = (result) => {
    if (!result) return 'border-gray-600 bg-gray-800';
    if (result.success) return 'border-green-500 bg-green-500/10';
    return 'border-red-500 bg-red-500/10';
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CodeBracketIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">API Test Panel</h3>
          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full">
            DEV ONLY
          </span>
        </div>
        
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4" />
              Run All Tests
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => {
          const result = testResults[test.id];
          const isCurrentlyRunning = isRunning && selectedTest === test.id;
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 transition-all ${getStatusColor(result)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{test.name}</h4>
                  <p className="text-sm text-gray-400">{test.description}</p>
                </div>
                {getStatusIcon(result)}
              </div>
              
              {result && (
                <div className="mb-3 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Duration:</span>
                    <span>{result.duration || 0}ms</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Time:</span>
                    <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                      {result.error}
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => runTest(test)}
                disabled={isRunning}
                className={`w-full px-3 py-2 bg-${test.color}-600 hover:bg-${test.color}-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors flex items-center justify-center gap-2`}
              >
                {isCurrentlyRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-3 h-3" />
                    Run Test
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">Test Results Summary</h4>
          <div className="text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Total Tests:</span>
              <span>{Object.keys(testResults).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Passed:</span>
              <span className="text-green-400">
                {Object.values(testResults).filter(r => r.success).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Failed:</span>
              <span className="text-red-400">
                {Object.values(testResults).filter(r => !r.success).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel;
