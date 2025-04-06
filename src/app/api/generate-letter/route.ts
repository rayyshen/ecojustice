import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { createLetterPrompt } from '../../utils/letterPromptEngineering';
import {
    LetterFormData,
    ElectedOfficial,
    GenerationConfig,
    GeminiContent
} from '../../../types/letter';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { formData, officials } = body as {
            formData: LetterFormData;
            officials: ElectedOfficial[];
        };

        if (!formData) {
            return NextResponse.json(
                { error: 'Form data is missing' },
                { status: 400 }
            );
        }

        if (!officials || !Array.isArray(officials) || officials.length === 0) {
            return NextResponse.json(
                { error: 'At least one recipient is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Missing Gemini API key');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }
        try {
            const genAI = new GoogleGenerativeAI(apiKey);

            const recipient = officials[0];

            const prompt = createLetterPrompt(formData, recipient);

            const model: GenerativeModel = genAI.getGenerativeModel({
                model: "gemini-2.0-flash"
            });

            const generationConfig: GenerationConfig = {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            };

            const content: GeminiContent[] = [
                { role: "user", parts: [{ text: prompt }] }
            ];

            const result = await model.generateContent({
                contents: content,
                generationConfig
            });

            if (!result.response) {
                throw new Error('No response generated from Gemini API');
            }

            const letter = result.response.text();
            if (!letter || letter.trim() === '') {
                throw new Error('Generated letter is empty');
            }

            return NextResponse.json({ letter });

        } catch (apiError) {
            console.error('Gemini API error:', apiError);

            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';

            if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
                return NextResponse.json(
                    {
                        error: 'Rate limit exceeded',
                        message: 'We\'re experiencing high demand. Please try again in a few minutes.'
                    },
                    { status: 429 }
                );
            }

            if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
                return NextResponse.json(
                    {
                        error: 'Content filtered',
                        message: 'The letter content couldn\'t be generated due to content safety policies. Please revise your letter description.'
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    error: 'Error generating letter with AI',
                    message: errorMessage || 'An error occurred while generating your letter.'
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Server error in generate-letter route:', error);
        return NextResponse.json(
            {
                error: 'Server error',
                message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'
            },
            { status: 500 }
        );
    }
}