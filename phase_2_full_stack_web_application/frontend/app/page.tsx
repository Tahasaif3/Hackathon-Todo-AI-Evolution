"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ListTodo } from 'lucide-react'
import { showToast } from '@/lib/toast'
import Lottie from "lottie-react";
import todoAnimation from "../animation/todo.json";
import { useRouter } from "next/navigation";

export default function Page() {
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  
  // Refs for sections to animate
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const tasksRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)
  
  // State for scroll animations
  const [heroInView, setHeroInView] = useState(false)
  const [aboutInView, setAboutInView] = useState(false)
  const [featuresInView, setFeaturesInView] = useState(false)
  const [tasksInView, setTasksInView] = useState(false)
  const [pricingInView, setPricingInView] = useState(false)
  const [testimonialsInView, setTestimonialsInView] = useState(false)
  const [newsletterInView, setNewsletterInView] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Check if sections are in view
      checkScrollAnimations()
    }
    
    window.addEventListener("scroll", handleScroll)
    
    // Initial check
    checkScrollAnimations()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Trigger initial animations after component mounts
    setIsVisible(true)
    setHeroInView(true)
  }, [])

  const checkScrollAnimations = () => {
    const checkSection = (ref: React.RefObject<HTMLElement>, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const triggerPoint = windowHeight * 0.75 // Trigger when 75% of section is visible
        
        if (rect.top <= triggerPoint && rect.bottom >= 0) {
          setter(true)
        }
      }
    }
    
    checkSection(aboutRef, setAboutInView)
    checkSection(featuresRef, setFeaturesInView)
    checkSection(tasksRef, setTasksInView)
    checkSection(pricingRef, setPricingInView)
    checkSection(testimonialsRef, setTestimonialsInView)
    checkSection(newsletterRef, setNewsletterInView)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex text-black items-center gap-2 text-xl font-bold">
              <ListTodo className="w-6 h-6" />
              <span>TaskFLow</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm border border-gray-200">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-sm px-4 py-2 text-gray-800 transition-all duration-300 rounded-full bg-white shadow-sm font-medium hover:shadow-md"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-300 rounded-full hover:bg-white/80 hover:shadow-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("tasks")}
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-300 rounded-full hover:bg-white/80 hover:shadow-sm font-medium"
              >
                Tasks
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-300 rounded-full hover:bg-white/80 hover:shadow-sm font-medium"
              >
                Pricing
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/register')}
                className="text-sm px-5 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 rounded-full hover:bg-gray-100"
              >
                Register
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="text-sm px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full font-medium hover:from-black hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero Section */}
        <section id="hero" className="bg-gradient-to-b from-gray-900 to-black text-white py-20" ref={heroRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className={`flex-1 max-w-xl transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-block mb-4 animate-pulse">
                  <span className="text-xs bg-white text-black px-3 py-1 rounded-full">
                    Unlock your productivity faster using🔥
                  </span>
                </div>
                <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-150 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Boost Your Productivity With TO-DO
                </h1>
                <p className={`text-lg text-gray-300 mb-8 transition-all duration-700 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  The Ultimate Task Management Tool To Keep You On Top Of Your Game And Accomplish Your Goals
                </p>
                <div className={`flex gap-4 transition-all duration-700 delay-500 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <button 
                    onClick={() => router.push('/register')}
                    className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => scrollToSection("features")}
                    className="px-6 py-3 border border-white rounded-full font-medium hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className={`flex-1 relative transition-all duration-1000 delay-200 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Image
                  src="/images/img-20hero.png"
                  alt="TO-DO App Mobile Screens"
                  width={600}
                  height={600}
                  className="w-full max-w-md mx-auto transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 text-white" ref={aboutRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Column - Content */}
              <div className={`flex-1 max-w-xl transition-all duration-1000 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Revolutionize Your Productivity
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Our cutting-edge task management platform combines intuitive design with powerful features to help you accomplish more in less time.
                </p>
                <div className="space-y-6">
                  <div className={`flex items-start gap-4 transition-all duration-700 delay-100 ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                    <div className="mt-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Smart Task Organization</h3>
                      <p className="text-gray-400">
                        Automatically categorize and prioritize tasks based on deadlines, importance, and your work patterns.
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-4 transition-all duration-700 delay-200 ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                    <div className="mt-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Seamless Collaboration</h3>
                      <p className="text-gray-400">
                        Work effortlessly with your team in real-time, sharing tasks, progress updates, and feedback instantly.
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-4 transition-all duration-700 delay-300 ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                    <div className="mt-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                      <p className="text-gray-400">
                        Gain valuable insights into your productivity trends and optimize your workflow with detailed reports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Animation */}
              <div className={`flex-1 relative transition-all duration-1000 delay-200 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 shadow-2xl">
                  <div className="rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 h-96 flex items-center justify-center">
                    <Lottie 
                      animationData={todoAnimation} 
                      loop={true} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-100" ref={featuresRef}>
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Experience The Ultimate Task Management Solution With TO-DO's Robust Features
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Take Control Of Your Workload And Boost Your Productivity With Customizable Lists, Smart Reminders, And
                More
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-100 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Intuitive Interface</h3>
                <p className="text-gray-600">
                  Our User-Friendly Interface Makes It Easy To Manage Your Tasks And Stay Organized.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-200 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Customizable Lists</h3>
                <p className="text-gray-600">
                  Create Custom Lists To Organize Your Tasks And Prioritize What's Most Important.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Reminders</h3>
                <p className="text-gray-600">
                  Set Reminders And Receive Notifications To Ensure You Never Miss A Deadline.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-400 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Collaboration Tools</h3>
                <p className="text-gray-600">
                  Share Lists With Others, Assign Tasks, And Collaborate In Real-Time To Get More Done.
                </p>
              </div>

              {/* Feature 5 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-500 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Security And Privacy</h3>
                <p className="text-gray-600">
                  Your Data Is Always Secure And Private With Our State-Of-The-Art Security Measures.
                </p>
              </div>

              {/* Feature 6 */}
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transition-all duration-700 delay-600 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Customer Support</h3>
                <p className="text-gray-600">
                  Our Friendly Support Team Is Always Here To Help You With Any Questions Or Issues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Add Tasks Section */}
        <section id="tasks" className="py-20 bg-gradient-to-b from-gray-900 to-black text-white" ref={tasksRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className={`flex-1 max-w-xl transition-all duration-1000 ${tasksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Add Tasks With Ease Using TO-DO's Intuitive Interface
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Quickly And Effortlessly Create Tasks To Stay Organized And On Track With Your Goals
                </p>
                
                {/* Mac-style Code Block */}
                <div className={`bg-gray-800 rounded-lg overflow-hidden mb-8 border border-gray-700 shadow-xl transition-all duration-700 delay-200 ${tasksInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex items-center px-4 py-2 bg-gray-900 border-b border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400 ml-2">task_example.js</div>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="text-gray-400">// Create a new task</div>
                    <div><span className="text-purple-400">const</span> <span className="text-white">newTask</span> <span className="text-white">=</span> <span className="text-yellow-400">&#123;</span></div>
                    <div className="ml-4"><span className="text-white">title:</span> <span className="text-green-400">&quot;Complete project proposal&quot;</span><span className="text-white">,</span></div>
                    <div className="ml-4"><span className="text-white">description:</span> <span className="text-green-400">&quot;Finish and submit the quarterly project proposal&quot;</span><span className="text-white">,</span></div>
                    <div className="ml-4"><span className="text-white">due_date:</span> <span className="text-green-400">&quot;2023-12-31&quot;</span><span className="text-white">,</span></div>
                    <div className="ml-4"><span className="text-white">completed:</span> <span className="text-blue-400">false</span></div>
                    <div><span className="text-yellow-400">&#125;</span><span className="text-white">;</span></div>
                    
                    <div className="mt-3 text-gray-400">// Send to API</div>
                    <div><span className="text-blue-400">await</span> <span className="text-yellow-400">createTask</span><span className="text-white">(userId, newTask);</span></div>
                  </div>
                </div>
              </div>
              <div className={`flex-1 relative transition-all duration-1000 delay-300 ${tasksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Image
                  src="/images/group-201.png"
                  alt="Task Management Interface"
                  width={500}
                  height={400}
                  className="w-full max-w-md mx-auto hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50 text-white" ref={pricingRef}>
          <div className="container mx-auto px-4">
            <div className={`text-center mb-16 transition-all duration-1000 ${pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-700">Find A Plan To Power Your Tasks</h2>
              <p className="text-gray-400 text-lg">Service Options From Free To Paid According To Your Needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Hobby Plan */}
              <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-6 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl transition-all duration-700 delay-100 ${pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hobby</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">$0</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Perfect For Non-Commercial Projects</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">2 days free storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Maximum 50 tasks per week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Cloud backup 5GB</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Maximum of 5 collaborators</span>
                  </li>
                </ul>

                <button className="w-full py-3 border border-gray-600 rounded-full font-medium hover:bg-gray-700/50 transition-all duration-200">
                  Start For Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`bg-white text-black rounded-2xl p-8 space-y-6 relative transform scale-105 shadow-2xl hover:scale-110 transition-all duration-300 transition-all duration-700 delay-200 ${pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">$20</span>
                    <span className="text-gray-600"> Per User / Month</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">For Professionals With Advanced Features</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">30 days free storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Maximum 150 tasks per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Cloud backup 50GB</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Maximum of 20 collaborators</span>
                  </li>
                </ul>

                <button 
                  className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-200"
                  onClick={() => showToast.success('Free trial started! Check your email for confirmation.')}
                >
                  Start Free Trial
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-6 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl transition-all duration-700 delay-300 ${pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">Custom</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    For Teams Who Need Security, Support, And Performance Needs
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Unlimited storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Unlimited Tasks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Cloud backup 1TB</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Unlimited collaborators</span>
                  </li>
                </ul>

                <button className="w-full py-3 border border-gray-600 rounded-full font-medium hover:bg-gray-700/50 transition-all duration-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white" ref={testimonialsRef}>
          <div className="container mx-auto px-4">
            <div className={`text-center mb-16 transition-all duration-1000 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Don't just take our word for it. Hear from professionals who have transformed their productivity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-6 transition-all duration-500 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: testimonialsInView ? '100ms' : '0ms'}}>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    JD
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-white text-lg">John Doe</h3>
                    <p className="text-gray-400 text-sm">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-300 italic text-base leading-relaxed">
                  "This tool has completely revolutionized how our team manages projects. We've seen a 40% increase in productivity since implementing it."
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-6 transition-all duration-500 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: testimonialsInView ? '200ms' : '0ms'}}>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    AS
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-white text-lg">Alice Smith</h3>
                    <p className="text-gray-400 text-sm">Freelance Designer</p>
                  </div>
                </div>
                <p className="text-gray-300 italic text-base leading-relaxed">
                  "As a freelancer, staying organized is crucial. This app helps me keep track of all my deadlines and deliverables effortlessly."
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-6 transition-all duration-500 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: testimonialsInView ? '300ms' : '0ms'}}>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    RJ
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-white text-lg">Robert Johnson</h3>
                    <p className="text-gray-400 text-sm">Startup Founder</p>
                  </div>
                </div>
                <p className="text-gray-300 italic text-base leading-relaxed">
                  "The collaboration features are outstanding. My entire team stays aligned, and we've reduced meeting time by 60% thanks to better task management."
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-white" ref={newsletterRef}>
          <div className="container mx-auto px-4">
            <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${newsletterInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl text-gray-700 font-bold mb-4">Subscribe Now! and Get Discounts Up To 70%</h2>
              <p className="text-gray-600 mb-8">
                Sign up today and start enjoying amazing benefits, including discounts!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-full placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-200"
                />
                <button 
                  type="button"
                  className="px-8 py-3 bg-white text-gray-600 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform hover:shadow-lg"
                  onClick={() => {
                    if (email && email.includes('@')) {
                      showToast.success('Thank you for subscribing! Check your email for confirmation.');
                      setEmail('');
                    } else {
                      showToast.error('Please enter a valid email address.');
                    }
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-8">
         <div className="flex text-white items-center gap-2 text-xl font-bold">
              <ListTodo className="w-8 h-8" />
              <span className="text-18 font-bold">TaskFlow</span>
            </div>
              
              {/* Social Icons */}
              <div className="flex gap-6">
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 transform"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 transform"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 transform"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859-.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
              
              {/* Copyright */}
              <div className="text-gray-500 text-sm pt-6 border-t border-gray-800">
                © {new Date().getFullYear()} Task Flow. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}