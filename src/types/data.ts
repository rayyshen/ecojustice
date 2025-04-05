export interface CSVData {
    headers: string[];
    rows: string[][];
}

export interface CountyData {
    id: string;
    position?: {
        lat: number;
        lng: number;
    };
    demographics: {
        population: number;
        medianIncome: number;
    };
    data: {
        SVI: number;
        risk: string;
    }
}

export interface FacilityData {
    name: string;
    latitude: number;
    longitude: number;
    TEQ: number;
    type?: string;
    governor: string;
    date: string;
}

export interface DemographicData {
    countyName: string;
    minorityPercentage: number;
    population: number;
}