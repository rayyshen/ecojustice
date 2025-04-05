import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountyMap from '@/components/map';

import '../app/globals.css'

export default function MapPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <Head>
                <title>Interactive Map | EcoJustice</title>
                <meta name="description" content="Explore environmental justice data and identify patterns of environmental racism across communities." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className="px-6 py-4 bg-white shadow-sm md:px-12 lg:px-20">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="text-2xl font-bold text-emerald-700 cursor-pointer">
                                Eco<span className="text-gray-800">Justice</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition">About</Link>
                        <Link href="/take-action" className="text-gray-700 hover:text-emerald-600 transition">Take Action</Link>
                        <a href="https://github.com/rayyshen/ecojustice" className="text-gray-400 hover:text-emerald-400 transition">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                </div>
            </nav>

            <header className="py-12 px-6 md:px-12 lg:px-20 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Environmental Justice Map</h1>
                        <p className="text-lg text-gray-600 max-w-3xl">
                            This interactive tool visualizes the relationship between environmental hazards, social vulnerability, and demographic data across U.S. counties. Identify patterns of environmental injustice and explore the impact on communities.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <CountyMap />
                    </motion.div>

                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Environmental Justice</h2>
                            <p className="text-gray-600 mb-4">
                                Environmental justice is the fair treatment and meaningful involvement of all people regardless of race, color, national origin, or income with respect to the development, implementation, and enforcement of environmental laws, regulations, and policies.
                            </p>
                            <p className="text-gray-600 mb-4">
                                This map combines data from the Social Vulnerability Index (SVI), U.S. Census demographic information, and EPA facility data to help identify communities that may face disproportionate environmental burdens.
                            </p>
                            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">How to Use This Map</h3>
                            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                                <li>Toggle between different data layers using the controls at the top right</li>
                                <li>Click on any county to view detailed information about vulnerability and demographics</li>
                                <li>Click on facility markers to learn about existing and proposed industrial sites</li>
                                <li>Use the legend to understand the color-coding system for vulnerability and demographic data</li>
                                <li>Take action by <Link href="/take-action" className="underline">contacting your local representative</Link></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6 bg-emerald-700 text-white">
                                <h3 className="text-xl font-bold mb-2">Resources</h3>
                                <p className="text-emerald-100">Additional information to help you understand and use our environmental justice data</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <a href="https://www.atsdr.cdc.gov/place-health/php/svi/index.html" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-gray-900 mb-1">Understanding SVI</h4>
                                    <p className="text-gray-600 text-sm">Learn how the Social Vulnerability Index is calculated and what it means</p>
                                </a>
                                <a href="/about" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-gray-900 mb-1">Case Studies</h4>
                                    <p className="text-gray-600 text-sm">Real-world examples of how communities are harmed by environmental racism</p>
                                </a>
                                <a href="/take-action" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-gray-900 mb-1">Take Action Guide</h4>
                                    <p className="text-gray-600 text-sm">Step-by-step guide to advocating for environmental justice in your community</p>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-900 text-white py-12 px-6 md:px-12 lg:px-20 mt-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="col-span-1 md:col-span-2">
                            <div className="text-2xl font-bold mb-4">
                                Eco<span className="text-emerald-400">Justice</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Change starts with education.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://github.com/rayyshen/ecojustice" className="text-gray-400 hover:text-emerald-400 transition">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </footer>
        </div>
    );
}