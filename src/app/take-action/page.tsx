"use client";
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LetterGenerator from '../../components/LetterGenerator';
import "../globals.css";

const TakeActionPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <Head>
                <title>Take Action | EcoJustice</title>
                <meta name="description" content="Take action against environmental racism in your community with advocacy tools, resources, and an AI-powered letter generator." />
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
                        <Link href="/map" className="text-gray-700 hover:text-emerald-600 transition">Map</Link>
                        <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition">About</Link>
                    </div>

                    <div className="md:hidden">
                        <button className="text-gray-700 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <header className="py-16 px-6 md:px-12 lg:px-20 bg-emerald-700 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Take Action Now
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-emerald-100 max-w-3xl mx-auto"
                        >
                            Powerful tools and resources to help you advocate for environmental justice in your community
                        </motion.p>
                    </div>
                </div>
            </header>

            <main className="py-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <section id="advocacy-tools" className="mb-16 scroll-mt-24">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white md:px-10">
                                <h2 className="text-3xl font-bold mb-2">AI-Powered Advocacy Letter Generator</h2>
                                <p className="text-lg opacity-90">
                                    Create personalized letters to send to your representatives about environmental justice issues in your community.
                                </p>
                            </div>

                            <LetterGenerator />
                        </div>
                    </section>
                </div>
            </main>
        </div>)
}

export default TakeActionPage;