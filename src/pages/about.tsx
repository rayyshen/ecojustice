// pages/about.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <Head>
                <title>About EcoJustice | Environmental Justice Data Initiative</title>
                <meta name="description" content="Learn about EcoJustice's mission to combat environmental racism through data visualization and community empowerment." />
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
                        <Link href="/dashboard" className="text-gray-700 hover:text-emerald-600 transition">Map</Link>
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

            {/* Header */}
            <header className="py-12 px-6 md:px-12 lg:px-20 bg-emerald-700 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Our Mission & Story
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-emerald-100 max-w-3xl"
                        >
                            Exposing environmental racism through data visualization and empowering communities to advocate for change
                        </motion.p>
                    </div>
                </div>
            </header>

            <main className="py-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2 p-8 md:p-10">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Inspiration: Africatown, Alabama</h2>
                                    <div className="prose prose-emerald max-w-none">
                                        <p>
                                            One of my friends visited the Africatown graveyard, documented the gravesites there, and learned about the environmental racism that occurred there. This includes the surrounding paper mills, asphalt plants, petrochemical storage, and other heavy industries. He learned about the legacy of redlining and zoning laws which allowed heavy industries to be placed right next to residential homes.
                                        </p>
                                        <p>
                                            When I learned about this, I was inspired to make this app in order to attempt to prevent future instances of environmental racism.
                                        </p>
                                        <p>
                                            Africatown was founded by formerly enslaved Africans who arrived on the last known slave ship to the United States, the Clotilda, in 1860. Despite its profound historical significance, the community has been subjected to decades of industrial encroachment and pollution.
                                        </p>
                                        <p>
                                            Today, residents continue to fight for environmental justice while preserving their unique cultural heritage. Their struggle exemplifies why tools like EcoJustice are necessary to identify patterns of environmental inequality and empower communities to advocate for change.
                                        </p>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative aspect-square">
                                            <Image
                                                src="/1.jpeg"
                                                alt="Africatown Cemetery"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative aspect-square">
                                            <Image
                                                src="/2.jpeg"
                                                alt="Industrial Facilities"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative aspect-square">
                                            <Image
                                                src="/3.jpeg"
                                                alt="Community"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative aspect-square">
                                            <Image
                                                src="/4.jpeg"
                                                alt="Historical Marker"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding the Social Vulnerability Index (SVI)</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        The CDC/ATSDR Social Vulnerability Index (SVI) uses 16 variables from U.S. Census data to identify communities that may need support before, during, or after disasters. Communities with higher SVI scores may be more vulnerable to environmental hazards and less able to recover from disasters.
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        EcoJustice uses SVI data as a critical component in identifying communities that may be disproportionately affected by environmental burdens. By overlaying SVI data with environmental hazard information, we can identify patterns of environmental injustice.
                                    </p>
                                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                                        <h4 className="font-bold text-emerald-800 mb-2">Why SVI Matters for Environmental Justice</h4>
                                        <p className="text-emerald-700 text-sm">
                                            Communities with high social vulnerability often face greater environmental burdens due to historical patterns of discrimination, lack of political power, and economic disinvestment. These communities may also have fewer resources to advocate for environmental protections or remediation.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">The 16 SVI Variables Across Four Themes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-blue-800 mb-2">Socioeconomic Status</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Below 150% poverty</li>
                                                <li>• Unemployed</li>
                                                <li>• Housing Cost Burden</li>
                                                <li>• Health Insurance Status</li>
                                                <li>• High School Diploma Status </li>
                                            </ul>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-green-800 mb-2">Household Composition</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Aged 65 or older</li>
                                                <li>• Aged 17 or younger</li>
                                                <li>• Disability status</li>
                                                <li>• Single-parent households</li>
                                            </ul>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-purple-800 mb-2">Minority Status & Language</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Racial/ethnic minority</li>
                                                <li>• Limited English proficiency</li>
                                            </ul>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-amber-800 mb-2">Housing & Transportation</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Multi-unit structures</li>
                                                <li>• Mobile homes</li>
                                                <li>• Crowding</li>
                                                <li>• No vehicle</li>
                                                <li>• Group quarters</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Environmental Racism: Historical Case Studies</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-300 relative">
                                    <div className="absolute inset-0 bg-emerald-700 bg-opacity-30 flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-bold">Cancer Alley, Louisiana</h3>
                                            <p className="text-sm">Industrial corridor along the Mississippi River</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        The 85-mile stretch between Baton Rouge and New Orleans is home to over 150 petrochemical plants and refineries. This area, nicknamed "Cancer Alley," has cancer rates significantly higher than the national average, with predominantly Black communities bearing the brunt of this pollution.
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        The region's high concentration of industrial facilities in predominantly Black communities is a textbook example of environmental racism, with historical zoning decisions and industrial permitting favoring placement of hazardous facilities near communities of color.
                                    </p>
                                    <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center">
                                        Read the full case study
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-300 relative">
                                    <div className="absolute inset-0 bg-emerald-700 bg-opacity-30 flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-bold">Altgeld Gardens, Chicago</h3>
                                            <p className="text-sm">Public housing surrounded by pollution</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        Built in 1945 on an abandoned landfill, the Altgeld Gardens housing project was surrounded by 50 landfills,
                                        hundreds of hazardous waste sites, and numerous industrial facilities. Known as a "toxic donut," this predominantly
                                        Black community faced extreme pollution.
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        The area became a focus of environmental justice organizing when resident Hazel Johnson formed People for
                                        Community Recovery in 1979. Her work earned her the title "mother of environmental justice" and brought
                                        national attention to the issue of environmental racism.
                                    </p>
                                    <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center">
                                        Read the full case study
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-300 relative">
                                    <div className="absolute inset-0 bg-emerald-700 bg-opacity-30 flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-bold">Navajo Nation Uranium Mining</h3>
                                            <p className="text-sm">Decades of radioactive contamination</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        From 1944 to 1986, nearly 30 million tons of uranium ore were extracted from Navajo lands, with the federal
                                        government as the primary purchaser. The mining operations employed many Navajo people who worked without proper
                                        protection or awareness of radiation risks.
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        The legacy of uranium mining left over 500 abandoned mines, widespread water contamination, and elevated rates
                                        of cancer and other health issues. Despite this, cleanup efforts have been slow, and many Navajo families
                                        continue to live with contamination decades later.
                                    </p>
                                    <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center">
                                        Read the full case study
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-300 relative">
                                    <div className="absolute inset-0 bg-emerald-700 bg-opacity-30 flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-bold">Flint, Michigan</h3>
                                            <p className="text-sm">Water crisis and systemic environmental neglect</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        The Flint water crisis began in 2014 when the city's water source was changed without proper treatment, exposing residents to lead contamination and other toxins. The predominantly Black and low-income community's concerns were ignored by officials for months.
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        This crisis highlighted how environmental racism can manifest through neglect and disinvestment in infrastructure serving minority communities, as well as through the dismissal of community concerns by those in power.
                                    </p>
                                    <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center">
                                        Read the full case study
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-emerald-700 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-8 md:p-10 text-white">
                                <h2 className="text-3xl font-bold mb-6">What You Can Do About Environmental Racism</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">1</span>
                                                Get Informed
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Use EcoJustice and other resources to understand the environmental conditions in your community. Knowledge is the first step toward meaningful action.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">2</span>
                                                Engage Your Community
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Share information with neighbors and community members. Form or join local environmental justice groups to amplify your collective voice.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">3</span>
                                                Contact Local Officials
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Reach out to city council members, county commissioners, and state representatives. Share the data and demand action on environmental hazards.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">4</span>
                                                Participate in Policy Process
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Attend public meetings about zoning, permitting, and development. Submit public comments on proposed projects that could impact environmental health.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">5</span>
                                                Support Environmental Justice Organizations
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Donate to or volunteer with organizations fighting for environmental justice at local, state, and national levels.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                                <span className="flex items-center justify-center w-8 h-8 bg-white text-emerald-700 rounded-full mr-3 font-bold">6</span>
                                                Use Data for Advocacy
                                            </h3>
                                            <p className="text-emerald-100 pl-11">
                                                Download reports from EcoJustice to support your advocacy. Data-driven arguments can be powerful tools for change.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Link href="/map" className="px-6 py-3 bg-white text-emerald-700 font-medium rounded-md hover:bg-gray-100 transition shadow-md text-center">
                                        Explore the Map
                                    </Link>
                                    <a href="/take-action" className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-emerald-600 transition text-center">
                                        Take Action
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Resources Section
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Resources & Further Reading</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Organizations</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">Environmental Justice Foundation</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">NAACP Environmental and Climate Justice Program</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">WE ACT for Environmental Justice</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">Deep South Center for Environmental Justice</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">Indigenous Environmental Network</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Government Resources</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">EPA Environmental Justice Screening Tool (EJSCREEN)</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">CDC/ATSDR Social Vulnerability Index</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">U.S. Census Bureau American Community Survey</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">EPA Toxic Release Inventory Program</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">EPA Environmental Justice 2020 Action Agenda</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Books & Reports</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">"Toxic Communities" by Dorceta Taylor</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">"A Terrible Thing to Waste" by Harriet A. Washington</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">"Dumping in Dixie" by Robert D. Bullard</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">"Clean and White" by Carl A. Zimring</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700">"From the Ground Up" by Luke W. Cole & Sheila R. Foster</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.section> */}
                </div>
            </main>

            {/* Footer */}
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
