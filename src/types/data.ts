export interface FacilityData {
    name: string;
    latitude: number;
    longitude: number;
    TEQ: number;
    type?: string;
}

export interface DemographicData {
    countyName: string;
    minorityPercentage: number;
}

export interface CountyData {
    id: string;
    demographics: { population: number; medianIncome: number; SVI: number };
    airQuality: { AQI: number; status: string };
}

export interface CSVData {
    headers: string[];
    rows: string[][];
}