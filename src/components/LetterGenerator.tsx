import React, { useState } from 'react';
import Image from 'next/image';
import { LetterFormData, ElectedOfficial, ApiErrorResponse, RepresentativesResponse, LetterGenerationResponse } from '../types/letter';

const LetterGenerator: React.FC = () => {
    const [formData, setFormData] = useState<LetterFormData>({
        name: '',
        email: '',
        zipCode: '',
        communityIssue: '',
        environmentalConcern: '',
        personalImpact: '',
        desiredOutcome: '',
    });

    const [letterContent, setLetterContent] = useState<string>('');
    const [generatingLetter, setGeneratingLetter] = useState<boolean>(false);
    const [officials, setOfficials] = useState<ElectedOfficial[]>([]);
    const [selectedOfficials, setSelectedOfficials] = useState<number[]>([]);
    const [step, setStep] = useState<number>(1);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [apiMessage, setApiMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData((prevState: LetterFormData): LetterFormData => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOfficialToggle = (officialId: number): void => {
        setSelectedOfficials(prev => {
            if (prev.includes(officialId)) {
                return prev.filter(id => id !== officialId);
            } else {
                return [...prev, officialId];
            }
        });
    };

    const findOfficials = async (): Promise<void> => {
        setError('');
        setApiMessage('');

        if (!formData.zipCode || formData.zipCode.length < 5) {
            setError('Please enter a valid ZIP code');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/representatives?zipCode=${formData.zipCode}`);
            console.log(response);
            const data = await response.json() as RepresentativesResponse | ApiErrorResponse;

            if (!response.ok) {
                throw new Error((data as ApiErrorResponse).message || 'Error finding representatives');
            }

            const representativesData = data as RepresentativesResponse;

            if (representativesData.officials && representativesData.officials.length > 0) {
                setOfficials(representativesData.officials);
                setStep(2);
            } else {
                setApiMessage(representativesData.message || "No representatives with email addresses were found for this location.");
            }
        } catch (error) {
            console.error('Error finding representatives:', error);
            setError(error instanceof Error ? error.message : 'Error finding representatives. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateLetter = async (): Promise<void> => {
        setError('');

        if (selectedOfficials.length === 0) {
            setError('Please select at least one representative');
            return;
        }


        setGeneratingLetter(true);

        try {
            const selectedOfficialsData = selectedOfficials.map(id =>
                officials.find(o => o.id === id)
            ).filter((official): official is ElectedOfficial => official !== undefined);

            const response = await fetch('/api/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formData,
                    officials: selectedOfficialsData
                })
            });

            if (!response.ok) {
                const errorData = await response.json() as ApiErrorResponse;
                throw new Error(errorData.error || 'Error generating letter');
            }

            const data = await response.json() as LetterGenerationResponse;
            setLetterContent(data.letter);
            setStep(3);
        } catch (error) {
            console.error('Error generating letter:', error);
            setError(error instanceof Error ? error.message : 'Error generating letter. Please try again.');
        } finally {
            setGeneratingLetter(false);
        }
    };

    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(letterContent);
        alert('Letter copied to clipboard!');
    };

    return (
        <div className="p-6 md:p-8">
            {step === 1 && (
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tell Us About Your Concern</h3>
                    <p className="text-gray-600 mb-6">
                        Fill out the form below to generate a customized letter that you can send to your local representatives.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email*</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                required
                                maxLength={5}
                                placeholder="Enter 5-digit ZIP code"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="communityIssue" className="block text-sm font-medium text-gray-700 mb-1">Describe the environmental justice issue in your community*</label>
                        <textarea
                            id="communityIssue"
                            name="communityIssue"
                            value={formData.communityIssue}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Example: There is a proposed chemical plant near my neighborhood that would impact our air quality and water safety."
                            required
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="environmentalConcern" className="block text-sm font-medium text-gray-700 mb-1">What specific environmental concern do you have?*</label>
                        <select
                            id="environmentalConcern"
                            name="environmentalConcern"
                            value={formData.environmentalConcern}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        >
                            <option value="">Select a concern</option>
                            <option value="air pollution from industrial facilities">Air pollution from industrial facilities</option>
                            <option value="water contamination">Water contamination</option>
                            <option value="toxic waste sites">Toxic waste sites</option>
                            <option value="lack of green spaces">Lack of green spaces</option>
                            <option value="flooding and poor drainage infrastructure">Flooding and poor drainage infrastructure</option>
                            <option value="lead exposure">Lead exposure</option>
                            <option value="proposed industrial development">Proposed industrial development</option>
                            <option value="other">Other (please specify in your description)</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="personalImpact" className="block text-sm font-medium text-gray-700 mb-1">How has this issue affected you personally? (optional)</label>
                        <textarea
                            id="personalImpact"
                            name="personalImpact"
                            value={formData.personalImpact}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Example: My children suffer from asthma that gets worse when air quality is poor, and we've noticed more respiratory issues in our neighborhood."
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="desiredOutcome" className="block text-sm font-medium text-gray-700 mb-1">What outcome would you like to see? (optional)</label>
                        <textarea
                            id="desiredOutcome"
                            name="desiredOutcome"
                            value={formData.desiredOutcome}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Example: Stricter regulations on industrial emissions, required community health impact assessments, or cancellation of the proposed facility."
                        ></textarea>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    {apiMessage && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
                            {apiMessage}
                        </div>
                    )}

                    <button
                        onClick={findOfficials}
                        disabled={loading}
                        className={`px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition shadow-md flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Finding Representatives...
                            </>
                        ) : 'Find My Representatives'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Select Recipients</h3>
                    <p className="text-gray-600 mb-6">
                        Choose which representatives you&apos;d like to send your letter to:
                    </p>

                    <div className="bg-amber-50 p-4 rounded-lg mb-6">
                        <ul className="divide-y divide-amber-200">
                            {officials.map(official => (
                                <li key={official.id} className="py-3 flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`official-${official.id}`}
                                        checked={selectedOfficials.includes(official.id)}
                                        onChange={() => handleOfficialToggle(official.id)}
                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`official-${official.id}`} className="ml-3 flex flex-1 items-center">
                                        {official.photoUrl && (
                                            <div className="mr-3 h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={official.photoUrl}
                                                    alt={official.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <span className="text-gray-900 font-medium">{official.name}</span>
                                            <span className="text-gray-600 block text-sm">{official.title}</span>
                                            <span className="text-gray-500 block text-sm">{official.email}</span>
                                        </div>
                                        {official.party && (
                                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${official.party === 'Democratic Party' ? 'bg-blue-100 text-blue-800' :
                                                official.party === 'Republican Party' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {official.party}
                                            </span>
                                        )}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
                        >
                            Back
                        </button>

                        <button
                            onClick={generateLetter}
                            disabled={generatingLetter}
                            className={`px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition shadow-md flex items-center ${generatingLetter ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {generatingLetter ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Letter...
                                </>
                            ) : 'Generate Letter'}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Generated Letter</h3>
                    <p className="text-gray-600 mb-6">
                        Review your letter below. You can copy it to your clipboard and send it to your selected representatives.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 whitespace-pre-line">
                        {letterContent}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setStep(2)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
                        >
                            Back
                        </button>

                        <button
                            onClick={copyToClipboard}
                            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition shadow-md"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LetterGenerator;