'use client';

import { useState } from 'react';
import MathBackground from '@/components/MathBackground';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    budget: '',
    message: '',
  });

  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', project: '', budget: '', message: '' });
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
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Info */}
            <div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                Let's Build
                <br />
                Together
              </h1>
              <div className="w-24 h-px bg-chalk-white mb-8" />
              
              <p className="text-xl text-chalk-gray mb-12 leading-relaxed">
                Have a project in mind? Want to discuss how we can help elevate
                your vision? We're here to listen and collaborate.
              </p>

              {/* Contact Methods */}
              <div className="space-y-8 mb-12">
                <div>
                  <div className="font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    EMAIL
                  </div>
                  <a
                    href="mailto:hello@onyxry.agency"
                    className="text-2xl hover:glow-text transition-all duration-300"
                  >
                    hello@onyxry.agency
                  </a>
                </div>

                <div>
                  <div className="font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    LOCATION
                  </div>
                  <p className="text-xl">Global — Remote First</p>
                </div>

                <div>
                  <div className="font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    RESPONSE TIME
                  </div>
                  <p className="text-xl">Within 24 hours</p>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="font-mono text-xs tracking-wider text-chalk-gray mb-4">
                  CONNECT WITH US
                </div>
                <div className="flex gap-6">
                  {[
                    { label: 'Twitter', href: 'https://twitter.com' },
                    { label: 'LinkedIn', href: 'https://linkedin.com' },
                    { label: 'GitHub', href: 'https://github.com' },
                    { label: 'Dribbble', href: 'https://dribbble.com' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chalk-gray hover:text-chalk-white transition-colors duration-300"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Decorative SVG */}
              <div className="mt-16 hidden lg:block">
                <svg width="300" height="150" viewBox="0 0 300 150">
                  <path
                    d="M 0 75 Q 75 25, 150 75 T 300 75"
                    className="chalk-line"
                    opacity="0.3"
                  />
                  <circle cx="75" cy="75" r="40" className="chalk-line" opacity="0.2" />
                  <circle cx="225" cy="75" r="40" className="chalk-line" opacity="0.2" />
                </svg>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pt-20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="relative">
                  <label htmlFor="name" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    YOUR NAME *
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
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'name' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Email */}
                <div className="relative">
                  <label htmlFor="email" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    EMAIL ADDRESS *
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
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'email' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Company */}
                <div className="relative">
                  <label htmlFor="company" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    COMPANY / ORGANIZATION
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    onFocus={() => setFocused('company')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors"
                  />
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'company' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Project Type */}
                <div className="relative">
                  <label htmlFor="project" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    PROJECT TYPE *
                  </label>
                  <select
                    id="project"
                    name="project"
                    required
                    value={formData.project}
                    onChange={handleChange}
                    onFocus={() => setFocused('project')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-chalk-dark">Select a service</option>
                    <option value="ai" className="bg-chalk-dark">Ethical AI Development</option>
                    <option value="design" className="bg-chalk-dark">UX/UI Design</option>
                    <option value="animation" className="bg-chalk-dark">Mathematical Animations</option>
                    <option value="architecture" className="bg-chalk-dark">Systems Architecture</option>
                    <option value="consulting" className="bg-chalk-dark">Consulting</option>
                    <option value="other" className="bg-chalk-dark">Other</option>
                  </select>
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'project' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Budget */}
                <div className="relative">
                  <label htmlFor="budget" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    ESTIMATED BUDGET
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    onFocus={() => setFocused('budget')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-chalk-dark">Select range</option>
                    <option value="10k-25k" className="bg-chalk-dark">$10k - $25k</option>
                    <option value="25k-50k" className="bg-chalk-dark">$25k - $50k</option>
                    <option value="50k-100k" className="bg-chalk-dark">$50k - $100k</option>
                    <option value="100k+" className="bg-chalk-dark">$100k+</option>
                  </select>
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'budget' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Message */}
                <div className="relative">
                  <label htmlFor="message" className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                    PROJECT DETAILS *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full bg-transparent border-b border-chalk-gray/30 py-3 text-lg focus:outline-none focus:border-chalk-white transition-colors resize-none placeholder:text-chalk-gray/30"
                  />
                  <div className={`absolute bottom-0 left-0 h-px bg-chalk-white transition-all duration-300 ${focused === 'message' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Submit Button */}
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
    </main>
  );
}
