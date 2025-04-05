// CountyMap
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Data, Marker, InfoWindow } from '@react-google-maps/api';
import { CSVData, CountyData, FacilityData, DemographicData } from '@/types/data';

const mapContainerStyle = { width: '100%', height: '600px' };
const center = { lat: 37.8, lng: -96 };

const CountyMap: React.FC = () => {
    const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
    const [csvData, setCsvData] = useState<CSVData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<FacilityData[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<FacilityData | null>(null);
    const [proposedFacilities, setProposedFacilities] = useState<FacilityData[]>([]);
    const [showSVI, setShowSVI] = useState(true);
    const [showDemographic, setShowDemographic] = useState(false);
    const [demographicData, setDemographicData] = useState<Map<string, DemographicData>>(new Map());
    const [showCurrentFacilities, setShowCurrentFacilities] = useState(true);
    const [showProposedFacilities, setShowProposedFacilities] = useState(true);

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

    const processDemographicData = (data: string) => {
        const rows = data.split('\n').map(row => row.split(','));
        const headerRow = rows[0];

        const processedData = new Map<string, DemographicData>();

        rows.slice(1).forEach(row => {

            const countyName = row[4];    // County Name
            const year = row[5]?.trim();          // Year
            const ageGroup = row[6]?.trim();      // Age Group
            const totalPop = parseInt(row[7]);     // Total Population
            const whitePop = parseInt(row[8]);     // White Alone Population

            if (year === '5' && ageGroup === '0') {
                const minorityPercentage = (totalPop - whitePop) / totalPop;

                if (!isNaN(minorityPercentage)) {
                    processedData.set(countyName, {
                        countyName: countyName,
                        minorityPercentage
                    });
                    console.log(`Processed ${countyName}: ${minorityPercentage}`);
                }
            }
        });

        console.log(`Total counties processed: ${processedData.size}`);
        return processedData;
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

    useEffect(() => {
        const loadDemographicData = async () => {
            try {
                const response = await fetch('/data/cc-est2023-alldata.csv');
                const csvText = await response.text();
                const processed = processDemographicData(csvText);
                setDemographicData(processed);
            } catch (error) {
                console.error('Error loading demographic data:', error);
            }
        };

        loadDemographicData();
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

        if (countyId && event.latLng) {
            const data = await fetchCountyData(countyId);
            setSelectedCounty({
                ...data,
                position: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
            });
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

    const getColorForDemographic = (countyName: string) => {
        const data = demographicData.get(countyName);
        if (!data) {
            console.log(`No demographic data for: ${countyName}`);
            return '#CCCCCC';
        }
        const percentage = data.minorityPercentage;
        console.log(`County: ${countyName}, Minority %: ${percentage}`);
        return percentage > 0.5 ? '#9C27B0' : '#2196F3';
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={4} options={{ disableDefaultUI: true }}>
                {!isLoading && csvData && (
                    <Data
                        key={`${showSVI}-${showDemographic}`}
                        onLoad={(dataLayer) => {
                            fetch('/data/counties.geojson')
                                .then(response => response.json())
                                .then(data => {
                                    dataLayer.addGeoJson(data);
                                    dataLayer.setStyle((feature) => {
                                        const countyName = feature.getProperty('NAME') + ' County';
                                        if (showSVI) {
                                            const svi = getRPLTheme(countyName);
                                            return {
                                                fillColor: getColorForSVI(svi),
                                                strokeColor: '#666666',
                                                strokeWeight: 0.5,
                                                fillOpacity: 0.8,
                                            };
                                        } else if (showDemographic) {
                                            return {
                                                fillColor: getColorForDemographic(countyName),
                                                strokeColor: '#666666',
                                                strokeWeight: 0.8,
                                                fillOpacity: 0.8,
                                            };
                                        }
                                        return {
                                            fillColor: '#CCCCCC',
                                            strokeColor: '#666666',
                                            strokeWeight: 0.5,
                                            fillOpacity: 0.1,
                                        };
                                    });
                                });
                        }}
                        onClick={onFeatureClick}
                    />
                )}

                {showCurrentFacilities && facilities.map((facility, index) => (
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

                {showProposedFacilities && proposedFacilities.map((facility, index) => (
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

                {selectedCounty && (
                    <InfoWindow
                        position={selectedCounty.position}
                        onCloseClick={() => setSelectedCounty(null)}
                    >
                        <div className="p-2">
                            <h2 className="text-lg font-bold mb-2">{selectedCounty.id}</h2>
                            <div className="text-sm">
                                <p><strong>Population:</strong> {selectedCounty.demographics.population}</p>
                                <p><strong>Median Income:</strong> ${selectedCounty.demographics.medianIncome}</p>
                                <p><strong>SVI:</strong> {selectedCounty.demographics.SVI.toFixed(2)}</p>
                                <p><strong>Air Quality:</strong> {selectedCounty.airQuality.status}</p>
                                <p><strong>AQI:</strong> {selectedCounty.airQuality.AQI.toFixed(2)}</p>
                            </div>
                        </div>
                    </InfoWindow>
                )}

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

            {/* Update layer controls */}
            <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-md">
                <h3 className="text-sm font-bold mb-2">Map Layers</h3>
                <div className="flex flex-col gap-2">
                    <div className="border-b pb-2 mb-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="mapLayer"
                                checked={showSVI}
                                onChange={() => {
                                    setShowSVI(true);
                                    setShowDemographic(false);
                                }}
                                className="mr-2"
                            />
                            Show SVI Data
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="mapLayer"
                                checked={showDemographic}
                                onChange={() => {
                                    setShowDemographic(true);
                                    setShowSVI(false);
                                }}
                                className="mr-2"
                            />
                            Show Demographic Data
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="mapLayer"
                                checked={!showSVI && !showDemographic}
                                onChange={() => {
                                    setShowSVI(false);
                                    setShowDemographic(false);
                                }}
                                className="mr-2"
                            />
                            No Layer
                        </label>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-1">Facilities</h4>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showCurrentFacilities}
                                onChange={(e) => setShowCurrentFacilities(e.target.checked)}
                                className="mr-2"
                            />
                            Current Facilities
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showProposedFacilities}
                                onChange={(e) => setShowProposedFacilities(e.target.checked)}
                                className="mr-2"
                            />
                            Proposed Facilities
                        </label>
                    </div>
                </div>
            </div>

            {/* Modify the legend to show appropriate information based on active layer */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-md">
                {showSVI ? (
                    <>
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
                    </>
                ) : showDemographic ? (
                    <>
                        <h3 className="text-sm font-bold mb-2">Population Demographics</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#9C27B0' }}></div>
                                <span className="text-xs">Minority Majority</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#2196F3' }}></div>
                                <span className="text-xs">White Majority</span>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

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
        </LoadScript>
    );
};

export default CountyMap;