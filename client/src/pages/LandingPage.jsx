import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';
import ProfileDropdown from '../components/dashboard/ProfileDropdown';
import { ArrowRightIcon } from '../components/Icons';

// ===========================================
// UI COMPONENTS (NO EXTERNAL DEPENDENCIES)
// ===========================================

// Professional Button Component with CSS animations
const Button = React.memo(({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled = false, 
  ariaLabel,
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-2xl border-none cursor-pointer transition-all duration-300 ease-out gap-2 focus:outline-none focus:ring-3 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group transform hover:scale-105 hover:-translate-y-1 active:scale-98';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#36B083] to-[#2d9a6e] hover:from-[#2d9a6e] hover:to-[#258a5a] text-black shadow-lg hover:shadow-xl hover:shadow-green-400/25',
    secondary: 'bg-gradient-to-r from-[#303030] to-[#404040] hover:from-[#404040] hover:to-[#505050] text-white shadow-md hover:shadow-lg border border-white/10'
  };
  
  const sizeClasses = {
    small: 'px-5 py-2.5 text-sm',
    medium: 'px-7 py-3.5 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const handleClick = useCallback((event) => {
    if (disabled) return;
    onClick?.(event);
  }, [onClick, disabled]);

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

// Clean Loading Component
const LoadingSpinner = React.memo(({ progress }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center z-50">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Clean loading spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-4 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4 mx-auto">
          <div
            className="h-full bg-gradient-to-r from-[#36B083] to-[#4F46E5] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-white/80 font-mono text-sm">
          {Math.round(progress)}% Loading...
        </p>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Enhanced Hero Section with clean design
const HeroSection = React.memo(({ onSignUp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="main"
      aria-labelledby="hero-heading"
    >
      {/* Clean Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Floating geometric shapes with pure CSS */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/5 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rotate-45 blur-lg animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-lg blur-lg animate-spin" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-md animate-ping" style={{ animationDelay: '3s', animationDuration: '5s' }} />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 text-center">
        <div className={`bg-black/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl transform transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <h1 
            id="hero-heading"
            className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            Built on Skills,
            <br />
            <span className="text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
              Driven by Innovation
            </span>
          </h1>
          
          <p 
            className={`text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          >
            Experience the future of collaboration with our AI-powered platform.
            Skip the noise, verify talent, find your crew, and ship projects that matter.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <Button
              variant="primary"
              size="large"
              onClick={onSignUp}
              ariaLabel="Start building together"
              className="min-w-[200px]"
            >
              Start Building <ArrowRightIcon aria-hidden="true" />
            </Button>
            
            <Button
              variant="secondary"
              size="large"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              ariaLabel="Watch demo video"
              className="min-w-[200px]"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Enhanced Navigation
const Navigation = React.memo(({ isLoggedIn, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        scrolled ? 'bg-black/30 backdrop-blur-xl border-b border-white/10 translate-y-0' : 'bg-transparent -translate-y-1'
      }`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4">
        <div className="flex justify-between items-center">
          <div className="transform transition-transform duration-300 hover:scale-105">
            {/* Larger logo - increased size significantly */}
            <div className="text-4xl md:text-5xl">
              <Logo showText={false} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4" role="group" aria-label="Account actions">
            {isLoggedIn ? (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => onNavigate('/dashboard')}
                  ariaLabel="Go to dashboard"
                >
                  Dashboard
                </Button>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => onNavigate('/login')}
                  ariaLabel="Login to your account"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => onNavigate('/signup')}
                  ariaLabel="Create a new account"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

// Enhanced Features Section with clean icons
const FeaturesSection = React.memo(() => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const featuresRef = useRef(null);

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our advanced algorithms match you with the perfect team members based on skills, experience, and project requirements.",
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-sm"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Real-time Collaboration", 
      description: "Work together seamlessly with integrated tools for communication, project management, and code sharing.",
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Skill Verification",
      description: "Verified skill assessments ensure you're working with qualified professionals who can deliver results.",
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      ),
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setTimeout(() => {
              setVisibleFeatures(prev => [...prev, index]);
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = featuresRef.current?.querySelectorAll('[data-index]');
    featureElements?.forEach(el => observer.observe(el));

    return () => {
      featureElements?.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Clean Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/4 right-1/6 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div ref={featuresRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16 transform transition-all duration-1000 opacity-100">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience the next generation of collaborative development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-index={index}
              className={`group transform transition-all duration-1000 ${
                visibleFeatures.includes(index) 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-20 opacity-0 scale-95'
              }`}
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-green-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/10 group-hover:scale-105 group-hover:-translate-y-2">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

// Enhanced Footer
const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Cookie Settings', href: '/cookies' },
    { label: 'Legal Notice', href: '/legal' },
    { label: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com/agile-atlas' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/agile-atlas' },
    { label: 'GitHub', href: 'https://github.com/agile-atlas' },
  ];

  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-6">
              {/* Larger logo in footer */}
              <div className="text-4xl md:text-5xl">
                <Logo showText={false} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-green-400 transition-all duration-200 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © {currentYear} Agile Atlas. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerLinks.slice(3).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function LandingPage() {
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser; // This creates a true/false boolean
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleSignUp = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner progress={loadingProgress} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white font-inter overflow-x-hidden">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-green-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-600/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }} />
      </div>

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only absolute top-4 left-4 bg-[#36B083] text-black px-4 py-2 rounded-lg font-semibold z-[100] focus:outline-none focus:ring-2 focus:ring-green-400/50"
      >
        Skip to main content
      </a>
      
      <Navigation isLoggedIn={isLoggedIn} onNavigate={handleNavigation} />

      <main id="main-content">
        <HeroSection onSignUp={handleSignUp} />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}