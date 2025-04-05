// components/CountyMap.tsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Data, Marker, InfoWindow } from '@react-google-maps/api';
import { count } from 'console';

const mapContainerStyle = { width: '100%', height: '600px' };
const center = { lat: 37.8, lng: -96 };

interface CountyData {
    id: string;
    demographics: { population: number; medianIncome: number; SVI: number };
    airQuality: { AQI: number; status: string };
}

interface CSVData {
    headers: string[];
    rows: string[][];
}

interface FacilityData {
    name: string;
    latitude: number;
    longitude: number;
    TEQ: number;
    type?: string;
}

const CountyMap: React.FC = () => {
    const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
    const [countyData, setCountyData] = useState<Map<string, number>>(new Map());
    const [csvData, setCsvData] = useState<CSVData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<FacilityData[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<FacilityData | null>(null);
    const [proposedFacilities, setProposedFacilities] = useState<FacilityData[]>([]);

    const getColorForSVI = (svi: number) => {
        if (isNaN(svi) || svi === null) return '#CCCCCC';
        if (svi < 0.25) return '#4CAF50';
        if (svi < 0.5) return '#FFEB3B';
        if (svi < 0.75) return '#FF9800';
        return '#F44336';
    };

    const getRPLTheme = (countyName: string): number => {
        if (!csvData) return 12;

        const RPLTotalIndex = csvData.headers.findIndex(col => col.trim() === 'RPL_THEMES');
        const countyNameIndex = csvData.headers.findIndex(col => col.trim() === 'COUNTY');

        if (RPLTotalIndex === -1 || countyNameIndex === -1) {
            console.error('Column indices not found:', { RPLTotalIndex, countyNameIndex });
            return 0;
        }

        const searchName = countyName;
        const countyRow = csvData.rows.find(row => row[countyNameIndex]?.trim() === searchName);

        if (!countyRow) {
            return 0;
        }

        const RPLTheme = parseFloat(countyRow[RPLTotalIndex]);

        return isNaN(RPLTheme) ? 0 : RPLTheme / 20;
    };

    useEffect(() => {
        const loadSVIData = async () => {
            setIsLoading(true);
            try {
                console.log('Fetching CSV data...');
                const response = await fetch('/data/SVI_2022_US_county.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvText = await response.text();
                console.log('CSV data received, first 100 chars:', csvText.substring(0, 100));

                const allRows = csvText.split('\n').map(row => row.split(','));
                console.log('Headers:', allRows[0]);
                console.log('First row:', allRows[1]);

                setCsvData({
                    headers: allRows[0],
                    rows: allRows.slice(1)
                });
            } catch (error) {
                console.error('Error loading SVI data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        loadSVIData();
    }, []);

    const fetchCountyData = async (countyId: string): Promise<CountyData> => {
        const RPLTotal = getRPLTheme(countyId);

        return {
            id: countyId,
            demographics: {
                population: 50000,
                medianIncome: 55000,
                SVI: RPLTotal,
            },
            airQuality: {
                AQI: RPLTotal,
                status: RPLTotal < 0.5 ? 'Good' : 'Poor'
            },
        };
    };

    const onFeatureClick = async (event: google.maps.Data.MouseEvent) => {
        const feature = event.feature;
        const countyName = feature.getProperty('NAME') || feature.getProperty('name');
        const countyId = countyName ? `${countyName} County` : null;

        if (countyId) {
            const data = await fetchCountyData(countyId);
            setSelectedCounty(data);
            console.log('Clicked county:', data);
        }
    };

    useEffect(() => {
        const loadFacilityData = async () => {
            try {
                const response = await fetch('/data/TEQ_2023.csv');
                const csvText = await response.text();
                const rows = csvText.split('\n').map(row => row.split(','));
                const headerRow = rows[0];


                const nameIndex = headerRow.indexOf('Facility Name');
                const latIndex = headerRow.indexOf('Latitude');
                const lonIndex = headerRow.indexOf('Longitude');
                const teqIndex = headerRow.indexOf('TEQ');

                const facilityData = rows.slice(1)
                    .filter(row => row.length >= 4)
                    .map(row => ({
                        name: row[nameIndex],
                        latitude: parseFloat(row[latIndex]),
                        longitude: parseFloat(row[lonIndex]),
                        TEQ: parseFloat(row[teqIndex])
                    }))
                    .filter(facility => !isNaN(facility.latitude) && !isNaN(facility.longitude));

                setFacilities(facilityData);
            } catch (error) {
                console.error('Error loading facility data:', error);
            }
        };

        loadFacilityData();
    }, []);

    useEffect(() => {
        const loadProposedFacilities = async () => {
            try {
                const response = await fetch('/data/proposed_industrial_plants.csv');
                const csvText = await response.text();
                const rows = csvText.split('\n').map(row => row.split(','));
                const headerRow = rows[0];

                const nameIndex = headerRow.indexOf('Name');
                const latIndex = headerRow.indexOf('Latitude');
                const lonIndex = headerRow.indexOf('Longitude');
                const typeIndex = headerRow.indexOf('Type');

                const facilityData = rows.slice(1)
                    .filter(row => row.length >= 4)
                    .map(row => ({
                        name: row[nameIndex],
                        latitude: parseFloat(row[latIndex]),
                        longitude: parseFloat(row[lonIndex]),
                        TEQ: 0,
                        type: row[typeIndex]
                    }))
                    .filter(facility => !isNaN(facility.latitude) && !isNaN(facility.longitude));

                setProposedFacilities(facilityData);
            } catch (error) {
                console.error('Error loading proposed facility data:', error);
            }
        };

        loadProposedFacilities();
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={4}>
                {!isLoading && csvData && (
                    <Data
                        onLoad={(dataLayer) => {
                            fetch('/data/counties.geojson')
                                .then(response => response.json())
                                .then(data => {
                                    dataLayer.addGeoJson(data);
                                    dataLayer.setStyle((feature) => {
                                        const countyName = feature.getProperty('NAME') + ' County';
                                        const svi = getRPLTheme(countyName);
                                        return {
                                            fillColor: getColorForSVI(svi),
                                            strokeColor: '#666666',
                                            strokeWeight: 0.5,
                                            fillOpacity: 0.8,
                                        };
                                    });
                                });
                        }}
                        onClick={onFeatureClick}
                    />
                )}

                {facilities.map((facility, index) => (
                    <Marker
                        key={index}
                        position={{
                            lat: facility.latitude,
                            lng: facility.longitude
                        }}
                        onClick={() => setSelectedFacility(facility)}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }}
                    />
                ))}

                {proposedFacilities.map((facility, index) => (
                    <Marker
                        key={`proposed-${index}`}
                        position={{
                            lat: facility.latitude,
                            lng: facility.longitude
                        }}
                        onClick={() => setSelectedFacility(facility)}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }}
                    />
                ))}

                {selectedFacility && (
                    <InfoWindow
                        position={{
                            lat: selectedFacility.latitude,
                            lng: selectedFacility.longitude
                        }}
                        onCloseClick={() => setSelectedFacility(null)}
                    >
                        <div className="p-2">
                            <h3 className="font-bold">{selectedFacility.name}</h3>
                            {selectedFacility.type && (
                                <p className="text-sm text-gray-600">{selectedFacility.type}</p>
                            )}
                            {selectedFacility.TEQ && (
                                <p className="text-sm">TEQ: {selectedFacility.TEQ}</p>
                            )}
                        </div>
                    </InfoWindow>
                )}

            </GoogleMap>

            {error && (
                <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading data: {error}
                </div>
            )}

            {isLoading && (
                <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md">
                    Loading data...
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-md">
                <h3 className="text-sm font-bold mb-2">Social Vulnerability Index</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#4CAF50' }}></div>
                        <span className="text-xs">Low (0.00 - 0.25)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#FFEB3B' }}></div>
                        <span className="text-xs">Medium-Low (0.25 - 0.50)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#FF9800' }}></div>
                        <span className="text-xs">Medium-High (0.50 - 0.75)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#F44336' }}></div>
                        <span className="text-xs">High (0.75 - 1.00)</span>
                    </div>
                </div>
            </div>

            {selectedCounty && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-md w-80">
                    <h2 className="text-xl font-bold mb-2">County Details</h2>
                    <p><strong>ID:</strong> {selectedCounty.id}</p>
                    <p>
                        <strong>Population:</strong> {selectedCounty.demographics.population}
                    </p>
                    <p>
                        <strong>Median Income:</strong> ${selectedCounty.demographics.medianIncome}
                    </p>
                    <p>
                        <strong>Air Quality Index:</strong> {selectedCounty.airQuality.AQI}
                    </p>
                    <p>
                        <strong>Status:</strong> {selectedCounty.airQuality.status}
                    </p>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setSelectedCounty(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </LoadScript>
    );
};

export default CountyMap;