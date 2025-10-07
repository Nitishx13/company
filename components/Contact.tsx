'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });

  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', project: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="relative z-10 min-h-screen py-32 px-6 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column - Info */}
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Let's Build
              <br />
              Together
            </h2>
            <div className="w-24 h-px bg-chalk-white mb-8" />
            
            <p className="text-xl text-chalk-gray mb-12 leading-relaxed">
              Have a project in mind? Want to discuss how we can help elevate
              your vision? We're here to listen and collaborate.
            </p>

            {/* Contact info */}
            <div className="space-y-6">
              <div className="group">
                <div className="text-sm font-mono text-chalk-gray mb-2">
                  EMAIL
                </div>
                <a
                  href="mailto:hello@onyxry.agency"
                  className="text-xl hover:glow-text transition-all duration-300"
                >
                  hello@onyxry.agency
                </a>
              </div>

              <div className="group">
                <div className="text-sm font-mono text-chalk-gray mb-2">
                  LOCATION
                </div>
                <p className="text-xl">Global — Remote First</p>
              </div>

              <div className="group">
                <div className="text-sm font-mono text-chalk-gray mb-2">
                  SOCIAL
                </div>
                <div className="flex gap-6">
                  <a
                    href="#"
                    className="text-chalk-gray hover:text-chalk-white transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="text-chalk-gray hover:text-chalk-white transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-chalk-gray hover:text-chalk-white transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="mt-16">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  className="chalk-line"
                  strokeDasharray="188"
                  strokeDashoffset="188"
                  style={{
                    animation: 'draw 2s ease-out infinite',
                  }}
                />
                <line
                  x1="80"
                  y1="50"
                  x2="120"
                  y2="50"
                  className="chalk-line"
                />
                <rect
                  x="130"
                  y="30"
                  width="40"
                  height="40"
                  className="chalk-line"
                  strokeDasharray="160"
                  strokeDashoffset="160"
                  style={{
                    animation: 'draw 2s ease-out 0.5s infinite',
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Right column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-sm font-mono text-chalk-gray mb-2"
                >
                  NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors"
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${
                    focused === 'name' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-mono text-chalk-gray mb-2"
                >
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors"
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${
                    focused === 'email' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Project Type */}
              <div className="relative">
                <label
                  htmlFor="project"
                  className="block text-sm font-mono text-chalk-gray mb-2"
                >
                  PROJECT TYPE
                </label>
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  onFocus={() => setFocused('project')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-chalk-dark">
                    Select a service
                  </option>
                  <option value="ai" className="bg-chalk-dark">
                    Ethical AI Development
                  </option>
                  <option value="design" className="bg-chalk-dark">
                    UX/UI Design
                  </option>
                  <option value="animation" className="bg-chalk-dark">
                    Mathematical Animations
                  </option>
                  <option value="architecture" className="bg-chalk-dark">
                    Systems Architecture
                  </option>
                  <option value="other" className="bg-chalk-dark">
                    Other
                  </option>
                </select>
                <div
                  className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${
                    focused === 'project' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Message */}
              <div className="relative">
                <label
                  htmlFor="message"
                  className="block text-sm font-mono text-chalk-gray mb-2"
                >
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors resize-none"
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${
                    focused === 'message' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group relative w-full sm:w-auto px-12 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 overflow-hidden mt-8"
              >
                <span className="relative z-10 font-mono text-sm tracking-wider">
                  SEND MESSAGE
                </span>
                <div className="absolute inset-0 bg-chalk-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
