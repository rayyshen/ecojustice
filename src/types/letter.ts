export interface LetterFormData {
    name: string;
    email: string;
    zipCode: string;
    communityIssue: string;
    environmentalConcern: string;
    personalImpact: string;
    desiredOutcome: string;
}

export interface ElectedOfficial {
    id: number;
    name: string;
    title: string;
    email: string;
    party?: string | null;
    photoUrl?: string | null;
}

export interface RepresentativesResponse {
    officials: ElectedOfficial[];
    message?: string;
}

export interface LetterGenerationResponse {
    letter: string;
}


export interface ApiErrorResponse {
    error: string;
    message?: string;
}

export interface CivicApiOfficial {
    name: string;
    address?: {
        line1: string;
        city: string;
        state: string;
        zip: string;
    }[];
    party?: string;
    phones?: string[];
    urls?: string[];
    photoUrl?: string;
    emails?: string[];
    channels?: {
        type: string;
        id: string;
    }[];
}

export interface CivicApiOffice {
    name: string;
    divisionId: string;
    levels?: string[];
    roles?: string[];
    officialIndices: number[];
}

export interface CivicApiResponse {
    normalizedInput: {
        line1: string;
        city: string;
        state: string;
        zip: string;
    };
    kind: string;
    offices?: CivicApiOffice[];
    officials?: CivicApiOfficial[];
    error?: {
        code: number;
        message: string;
        errors: any[];
    };
}

export type EnvironmentalConcern =
    | "air pollution from industrial facilities"
    | "water contamination"
    | "toxic waste sites"
    | "lack of green spaces"
    | "flooding and poor drainage infrastructure"
    | "lead exposure"
    | "proposed industrial development"
    | "other";


export interface GenerationConfig {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
}

export interface GeminiContent {
    role: string;
    parts: {
        text: string;
    }[];
}