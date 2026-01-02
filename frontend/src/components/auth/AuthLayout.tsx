import React, { useState } from 'react';
import FeatureSlider from './FeatureSlider';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

type AuthView = 'login' | 'register';

const AuthLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-[#0fc9e7] to-[#4756ca] flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Complaint Management System</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 bg-[#fcfcfc]">
        {/* Left Section - Feature Slider */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5">
          <FeatureSlider />
        </div>

        {/* Right Section - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {currentView === 'login' ? (
              <LoginView onSwitchToRegister={() => setCurrentView('register')} />
            ) : (
              <RegisterView onSwitchToLogin={() => setCurrentView('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;