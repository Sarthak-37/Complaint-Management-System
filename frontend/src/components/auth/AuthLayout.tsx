import React, { useState } from 'react';
import FeatureSlider from './FeatureSlider';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

type AuthView = 'login' | 'register';

const AuthLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen flex bg-[#fcfcfc]">
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
  );
};

export default AuthLayout;