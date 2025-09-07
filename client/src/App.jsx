import React, { useState } from 'react';

// Helper component for SVG Icons
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d={path} />
  </svg>
);

// Logo component
const Logo = () => (
  <div className="flex items-center space-x-3">
    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
      <div className="w-5 h-5 bg-gray-900 rounded-full"></div>
    </div>
    <span className="text-white text-3xl font-bold font-poppins">AgileAtlas</span>
  </div>
);

// Header component
const Header = () => (
  <header className="w-full px-4 sm:px-8 md:px-16 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Logo />
      <nav className="hidden lg:flex items-center bg-[#303030] px-8 py-3 rounded-full space-x-10">
        <a href="#reviews" className="text-white font-semibold font-montserrat hover:text-[#36B083] transition-colors">Reviews</a>
        <a href="#discover" className="text-white font-semibold font-montserrat hover:text-[#36B083] transition-colors">Discover</a>
        <a href="#about" className="text-white font-semibold font-montserrat hover:text-[#36B083] transition-colors">About</a>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="hidden sm:block bg-[#303030] text-white font-semibold font-montserrat px-6 py-3 rounded-full hover:bg-gray-600 transition-colors">
          Login
        </button>
        <button className="bg-[#36B083] text-black font-semibold font-montserrat px-6 py-3 rounded-full hover:bg-opacity-80 transition-opacity">
          Get Started
        </button>
      </div>
    </div>
    <div className="w-full h-[1px] bg-[#847F7F] mt-4"></div>
  </header>
);

// Hero section component
const Hero = () => (
  <section className="w-full px-4 sm:px-8 md:px-16 py-16 lg:py-24">
    <div className="max-w-7xl mx-auto bg-[#303030] rounded-3xl p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight">
            Built on Skills, Driven by Collaboration
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 font-montserrat">
            Skip the noise, verify talent, find your crew, and ship projects that matter.
          </p>
          <button className="mt-10 bg-[#36B083] text-[#212121] font-bold font-montserrat px-8 py-4 rounded-xl flex items-center space-x-2 text-lg hover:bg-opacity-90 transition-transform hover:scale-105">
            <span>Build Together</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div>
          {/* Placeholder for the hero image */}
          <div className="w-full h-80 lg:h-96 bg-green-900/50 rounded-2xl grid grid-cols-6 gap-2 p-2 overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className={`rounded-full ${i % 3 === 0 ? 'bg-green-400/80' : 'bg-green-500/50'} ${ i % 7 === 0 ? 'scale-75' : ''} aspect-square`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Feature card carousel section
const FeaturesCarousel = () => {
  const carouselItems = [
    {
      title: 'AI matching',
      description: 'Smarter connections, faster projects!',
      imgSrc: 'https://placehold.co/80x80/212121/36B083?text=AI',
      alt: 'AI Matching Icon',
      bgColorClass: 'bg-[#36B083]/40',
      titleClass: 'opacity-70',
    },
    {
      title: 'connect',
      description: 'Collaborate with verified professionals worldwide!',
      imgSrc: 'https://placehold.co/95x95/212121/FFFFFF?text=Connect',
      alt: 'Connect Icon',
      bgColorClass: 'bg-[#36B083]',
      titleClass: 'opacity-100',
    },
    {
      title: 'launch',
      description: 'Turn side-hustles into real-world products!',
      imgSrc: 'https://placehold.co/80x80/212121/36B083?text=Launch',
      alt: 'Launch Icon',
      bgColorClass: 'bg-[#36B083]/40',
      titleClass: 'opacity-70',
    },
    {
      title: 'Innovate',
      description: 'Bring your creative ideas to life with our powerful tools.',
      imgSrc: 'https://placehold.co/80x80/212121/36B083?text=Idea',
      alt: 'Innovate Icon',
      bgColorClass: 'bg-[#36B083]/40',
      titleClass: 'opacity-70',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? carouselItems.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === carouselItems.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 py-16 lg:py-24">
      <div className="max-w-xl mx-auto bg-[#303030] rounded-2xl p-8 lg:p-12 relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {carouselItems.map((item, index) => (
              <div className="min-w-full flex-shrink-0" key={index}>
                <div className={`${item.bgColorClass} p-8 rounded-2xl text-center flex flex-col items-center justify-around space-y-4 shadow-lg mx-auto max-w-sm h-[280px]`}>
                  <img src={item.imgSrc} alt={item.alt} className="rounded-full"/>
                  <h3 className={`text-white text-2xl md:text-3xl font-bold font-montserrat ${item.titleClass}`}>{item.title}</h3>
                  <p className="text-white text-sm font-montserrat px-4">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Arrow */}
        <button onClick={prevSlide} className="absolute top-1/2 left-0 md:-left-16 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-2 hover:bg-black/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        {/* Right Arrow */}
        <button onClick={nextSlide} className="absolute top-1/2 right-0 md:-right-16 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-2 hover:bg-black/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-3 items-center">
            {carouselItems.map((_, slideIndex) => (
              <button key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-2.5 h-2.5 rounded-full ${currentIndex === slideIndex ? 'bg-white' : 'bg-gray-500'} transition-colors`}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// How it works section
const HowItWorks = () => (
    <section className="w-full px-4 sm:px-8 md:px-16 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-12">How it works?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <img src="https://placehold.co/400x250/303030/FFFFFF?text=Step+1" alt="Create a new project" className="rounded-xl mb-4 w-full h-auto"/>
                    <h3 className="text-white text-xl font-bold font-montserrat opacity-80">create a new project</h3>
                </div>
                <div className="text-center">
                    <img src="https://placehold.co/400x250/303030/FFFFFF?text=Step+2" alt="Collaborate" className="rounded-xl mb-4 w-full h-auto"/>
                    <h3 className="text-white text-xl font-bold font-montserrat opacity-80">collaborate</h3>
                </div>
                <div className="text-center">
                    <img src="https://placehold.co/400x250/303030/FFFFFF?text=Step+3" alt="Build" className="rounded-xl mb-4 w-full h-auto"/>
                    <h3 className="text-white text-xl font-bold font-montserrat opacity-80">Build</h3>
                </div>
            </div>
        </div>
    </section>
);

// More features section
const MoreFeatures = () => (
    <section className="w-full px-4 sm:px-8 md:px-16 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-12">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#303030] rounded-3xl p-6 flex flex-col items-center shadow-xl">
                    <img src="https://placehold.co/300x200/000000/FFFFFF?text=Community" alt="Community Driven" className="rounded-2xl mb-4"/>
                    <h3 className="text-white text-xl font-bold font-montserrat">Community Driven</h3>
                    <p className="text-gray-400 text-sm text-center mt-2 font-montserrat">Connect with developers, designers, and innovators worldwide.</p>
                </div>
                <div className="bg-[#303030] rounded-3xl p-6 flex flex-col items-center shadow-xl">
                    <img src="https://placehold.co/300x200/000000/FFFFFF?text=Freelancers" alt="Hire Freelancers" className="rounded-2xl mb-4"/>
                    <h3 className="text-white text-xl font-bold font-montserrat">Hire freelancers</h3>
                    <p className="text-gray-400 text-sm text-center mt-2 font-montserrat">Find and hire verified talent for your next project.</p>
                </div>
                <div className="bg-[#303030] rounded-3xl p-6 flex flex-col items-center shadow-xl">
                    <img src="https://placehold.co/300x200/000000/FFFFFF?text=Secure" alt="Secure & Private" className="rounded-2xl mb-4"/>
                    <h3 className="text-white text-xl font-bold font-montserrat">Secure & Private</h3>
                    <p className="text-gray-400 text-sm text-center mt-2 font-montserrat">Your data and projects are protected with enterprise-level security.</p>
                </div>
            </div>
        </div>
    </section>
);

// Footer component
const Footer = () => (
    <footer className="w-full px-4 sm:px-8 md:px-16 py-8">
        <div className="max-w-7xl mx-auto bg-[#303030] rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h4 className="text-white font-semibold font-montserrat">Follow us</h4>
                    {/* Placeholder for social icons */}
                    <div className="flex space-x-3">
                        <a href="#" className="w-7 h-7 bg-gray-400 rounded-full hover:bg-[#36B083]"></a>
                        <a href="#" className="w-7 h-7 bg-gray-400 rounded-full hover:bg-[#36B083]"></a>
                        <a href="#" className="w-7 h-7 bg-gray-400 rounded-full hover:bg-[#36B083]"></a>
                        <a href="#" className="w-7 h-7 bg-gray-400 rounded-full hover:bg-[#36B083]"></a>
                    </div>
                </div>
            </div>
            <div className="w-full h-[1px] bg-white my-6 opacity-50"></div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
                <p className="text-white font-semibold font-montserrat">@ 2025 Agile Atlas</p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <a href="#" className="text-white hover:underline">Terms of Services</a>
                    <a href="#" className="text-white hover:underline">Privacy Policy</a>
                    <a href="#" className="text-white hover:underline">Accessibility</a>
                    <a href="#" className="text-white hover:underline">Cookie Settings</a>
                    <a href="#" className="text-white hover:underline">Legal Notice</a>
                    <a href="#" className="text-white hover:underline">FAQ</a>
                </div>
            </div>
        </div>
    </footer>
);


// Main App component
export default function App() {
  return (
    <div className="bg-[#212121] min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturesCarousel />
        <HowItWorks />
        <MoreFeatures />
      </main>
      <Footer />
    </div>
  );
}

