import React from "react";

const App = () => {
  return (
    <div className="bg-[#212121] text-white w-full min-h-screen flex flex-col items-center">
      {/* NAVBAR */}
      <header className="w-full max-w-7xl flex justify-between items-center py-6 px-10">
        <h1 className="text-2xl font-bold">AgileAtlas</h1>
        <nav className="hidden md:flex gap-8 font-semibold">
          <a href="#discover" className="hover:text-[#f63c3c]">Discover</a>
          <a href="#about" className="hover:text-[#f63c3c]">About</a>
          <a href="#reviews" className="hover:text-[#f63c3c]">Reviews</a>
        </nav>
        <div className="flex gap-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-white hover:text-black">Login</button>
          <button className="px-4 py-2 bg-[#f63c3c] rounded-lg hover:bg-red-700">Get Started</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full max-w-7xl grid md:grid-cols-2 gap-10 items-center px-10 py-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Built on Skills, <br /> Driven by Collaboration
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Skip the noise, verify talent, and join forces for high-impact projects.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#f63c3c] rounded-lg hover:bg-red-700">
            Build Together
          </button>
        </div>
        {/* Image removed */}
      </section>

      {/* FEATURES */}
      <section className="w-full max-w-7xl px-10 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">AI Verification</p>
          </div>
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Smart Connections</p>
          </div>
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Fast Launch</p>
          </div>
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Team Matching</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="w-full max-w-7xl px-10 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">How it works?</h3>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Create a new project</p>
          </div>
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Collaborate</p>
          </div>
          <div>
            {/* Image removed */}
            <p className="mt-4 font-semibold">Build</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#181818] py-10 px-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-400 flex flex-wrap gap-4">
            <a href="#">Terms of Services</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Cookie Settings</a>
            <a href="#">Legal Notice</a>
            <a href="#">FAQ</a>
          </div>
          <div className="flex gap-6">
            {/* Social icons removed */}
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Agile Atlas. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
