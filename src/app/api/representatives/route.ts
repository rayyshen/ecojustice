import { NextRequest, NextResponse } from 'next/server';
import {
    CivicApiResponse,
    ElectedOfficial
} from '../../../types/letter';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const zipCode = searchParams.get('zipCode');

        if (!zipCode) {
            return NextResponse.json(
                { error: 'ZIP code is required' },
                { status: 400 }
            );
        }

        const CIVIC_API_KEY = process.env.GOOGLE_CIVIC_API_KEY;
        if (!CIVIC_API_KEY) {
            throw new Error('Google Civic API key is not configured');
        }

        const response = await fetch(
            `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=${zipCode}&roles=legislatorLowerBody&roles=legislatorUpperBody&roles=headOfGovernment&roles=deputyHeadOfGovernment&roles=executiveCouncil&key=AIzaSyA6SOZc2cGVG1Kwa4SmYeSbRwRwkI_d3aE`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google Civic API error:', errorData);
            throw new Error(`Google Civic API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data: CivicApiResponse = await response.json();

        const officials: ElectedOfficial[] = [];
        let id = 1;

        if (data.offices && data.officials) {
            data.offices.forEach(office => {
                const officeName = office.name;

                office.officialIndices.forEach(index => {
                    const official = data.officials?.[index];

                    if (official && official.emails && official.emails.length > 0) {
                        officials.push({
                            id: id++,
                            name: official.name,
                            title: officeName,
                            email: official.emails[0],
                            party: official.party || null,
                            photoUrl: official.photoUrl || null
                        });
                    }
                });
            });
        }

        if (officials.length === 0) {
            return NextResponse.json({
                officials: [],
                message: "No representatives with email addresses were found for this location. Try contacting your local government directly for contact information."
            });
        }

        return NextResponse.json({ officials });
    } catch (error) {
        console.error('Error fetching representatives:', error);
        return NextResponse.json(
            {
                error: 'Error fetching representatives',
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}