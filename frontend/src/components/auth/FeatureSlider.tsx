import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  ShieldAlert, 
  Gavel, 
  Lock, 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  tags: string[]; // Added: Specific features displayed as pills
}

const features: Feature[] = [
  {
    icon: UserCheck,
    title: 'Citizen Empowerment',
    description: 'Raise your voice with complete transparency. Track your complaint journey from submission to resolution with a detailed history timeline.',
    gradient: 'from-[#0fc9e7] to-[#3186b2]',
    tags: ['Create & Track', 'Real-time Timeline', 'Reopen Capabilities']
  },
  {
    icon: Gavel,
    title: 'Authority Workspace',
    description: 'A dedicated environment for specialists. Manage category-specific complaints, adjust priorities, and escalate complex issues efficiently.',
    gradient: 'from-[#3186b2] to-[#4756ca]',
    tags: ['Invite Only', 'Priority Management', 'Escalation Protocols']
  },
  {
    icon: ShieldAlert,
    title: 'Admin Governance',
    description: 'Complete oversight of the platform. Manage user access, assign authorities, and visualize system health through advanced analytics.',
    gradient: 'from-[#4756ca] to-[#8E2DE2]',
    tags: ['User Management', 'Analytics Dashboard', 'Review & Assign']
  },
  {
    icon: Lock,
    title: 'Secure Lifecycle',
    description: 'Built on a strict Role-Based Access Control model. Every action is verified, and data flows through a predefined, immutable security lifecycle.',
    gradient: 'from-[#FF512F] to-[#DD2476]',
    tags: ['RBAC Security', 'Verified Access', 'Strict Workflow']
  }
];

const FeatureSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 6000); // Increased slightly to give time to read tags

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    setIsPaused(true);
    
    if (direction === 'prev') {
      setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    } else {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }

    setTimeout(() => setIsPaused(false), 500);
  };

  const CurrentIcon = features[currentSlide].icon;

  return (
    <div className="relative h-full flex flex-col justify-center items-center p-12 overflow-hidden bg-gray-900 rounded-xl">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-linear-to-br ${features[currentSlide].gradient} transition-all duration-1000 opacity-90`} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
        {/* Icon Container */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md shadow-lg transition-all duration-500 transform hover:scale-110">
          <CurrentIcon className="w-12 h-12 text-white drop-shadow-md" />
        </div>

        {/* Slide Content with Transition */}
        <div className="transition-all duration-500 transform flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-sm transition-opacity duration-500">
            {features[currentSlide].title}
          </h2>
          <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-lg mb-8 transition-opacity duration-500 font-light">
            {features[currentSlide].description}
          </p>

          {/* NEW: Feature Tags/Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {features[currentSlide].tags.map((tag, idx) => (
              <span 
                key={`${currentSlide}-${idx}`}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide shadow-sm animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={() => handleNavigation('prev')}
            className="group w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-3">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsAutoPlaying(false);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 500);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleNavigation('next')}
            className="group w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSlider;