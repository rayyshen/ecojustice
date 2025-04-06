import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Data, Marker, InfoWindow } from '@react-google-maps/api';
import { CSVData, CountyData, FacilityData, DemographicData } from '@/types/data';
import Link from 'next/link';
import { parse } from 'path';
import { head, header } from 'framer-motion/client';

const mapContainerStyle = {
    width: '100%',
    height: '700px',
    borderRadius: '0.75rem',
};

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
    const [legendVisible, setLegendVisible] = useState(true);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

    const getColorForSVI = (svi: number) => {
        if (isNaN(svi) || svi === null || svi === 0) return '#E5E7EB';
        if (svi < 0.25) return '#10B981';
        if (svi < 0.5) return '#FBBF24';
        if (svi < 0.75) return '#F97316';
        return '#EF4444';
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
                        minorityPercentage,
                        population: totalPop
                    });
                }
            }
        });

        return processedData;
    };

    useEffect(() => {
        const loadSVIData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/data/SVI_2022_US_county.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvText = await response.text();

                const allRows = csvText.split('\n').map(row => row.split(','));

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
        const risk = RPLTotal == 0 ? 'N/A' : RPLTotal < 0.25 ? 'Low' : RPLTotal < 0.5 ? 'Medium' : RPLTotal < 0.75 ? 'High' : 'Extremely High';

        return {
            id: countyId,
            demographics: {
                population: -1,
                medianIncome: -1,
            },
            data: {
                SVI: RPLTotal,
                risk: risk
            }
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
                const govIndex = headerRow.indexOf('Governor');
                const dateIndex = headerRow.indexOf('Date');

                const facilityData = rows.slice(1)
                    .filter(row => row.length >= 4)
                    .map(row => ({
                        name: row[nameIndex],
                        latitude: parseFloat(row[latIndex]),
                        longitude: parseFloat(row[lonIndex]),
                        TEQ: parseFloat(row[teqIndex]),
                        governor: row[govIndex],
                        date: row[dateIndex]
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
                const response = await fetch('/data/proposed.csv');
                const csvText = await response.text();
                const rows = csvText.split('\n').map(row => row.split(','));
                const headerRow = rows[0];

                const nameIndex = headerRow.indexOf('Name');
                const latIndex = headerRow.indexOf('Latitude');
                const lonIndex = headerRow.indexOf('Longitude');
                const typeIndex = headerRow.indexOf('Type');
                const govIndex = headerRow.indexOf('Governor');
                const dateIndex = headerRow.indexOf('Date');

                const facilityData = rows.slice(1)
                    .filter(row => row.length >= 4)
                    .map(row => ({
                        name: row[nameIndex],
                        latitude: parseFloat(row[latIndex]),
                        longitude: parseFloat(row[lonIndex]),
                        TEQ: 0,
                        type: row[typeIndex],
                        governor: row[govIndex],
                        date: row[dateIndex]
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
            return '#E5E7EB';
        }
        const percentage = data.minorityPercentage;

        if (percentage < 0.5) return '#3B82F6';
        return '#7C3AED';
    };

    const getDemographicDataForCounty = (countyName: string) => {
        const data = demographicData.get(countyName);
        return data ? (data.minorityPercentage * 100).toFixed(1) : 'N/A';
    };

    const getPopulation = (CountyName: string) => {
        const data = demographicData.get(CountyName);
        return data ? data.population.toLocaleString() : 'N/A';
    };

    const getMarkerIcon = (iconPath: string) => {
        if (!isGoogleLoaded || typeof google === 'undefined') {
            return undefined;
        }
        return {
            url: iconPath,
            scaledSize: new google.maps.Size(32, 32)
        };
    };

    return (
        <div className="relative w-full">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6 bg-emerald-700 text-white">
                    <h2 className="text-2xl font-bold mb-2">Interactive Environmental Justice Map</h2>
                    <p className="text-emerald-100">Explore environmental vulnerability and demographic data across the United States.</p>
                </div>

                <div className="relative">
                    <LoadScript
                        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                        onLoad={() => setIsGoogleLoaded(true)}
                    >
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={4}
                            options={{
                                disableDefaultUI: true,
                                styles: [
                                    {
                                        featureType: "water",
                                        elementType: "geometry",
                                        stylers: [{ color: "#E0F2F1" }]
                                    },
                                    {
                                        featureType: "landscape",
                                        elementType: "geometry",
                                        stylers: [{ color: "#F5F5F5" }]
                                    }
                                ]
                            }}
                        >
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
                                    icon={getMarkerIcon('/current-facility-marker.svg')}
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
                                    icon={getMarkerIcon('/proposed-facility-marker.svg')}
                                />
                            ))}

                            {selectedCounty && (
                                <InfoWindow
                                    position={selectedCounty.position}
                                    onCloseClick={() => setSelectedCounty(null)}
                                >
                                    <div className="p-4 max-w-xs">
                                        <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">{selectedCounty.id}</h2>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Population:</span>
                                                <span className="font-medium">{getPopulation(selectedCounty.id)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">SVI Score:</span>
                                                <span className="font-medium">{selectedCounty.data.SVI.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Risk Level:</span>
                                                <span className={`font-medium ${selectedCounty.data.risk === 'Low' ? 'text-emerald-600' :
                                                    selectedCounty.data.risk === 'Medium' ? 'text-amber-500' :
                                                        selectedCounty.data.risk === 'High' ? 'text-orange-500' :
                                                            selectedCounty.data.risk === 'Extremely High' ? 'text-red-600' : ''
                                                    }`}>{selectedCounty.data.risk}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Minority Population: </span>
                                                <span className="font-medium">{getDemographicDataForCounty(selectedCounty.id)}%</span>
                                            </div>
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
                                    <div className="p-4 max-w-xs">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedFacility.name}</h3>
                                        {selectedFacility.type && (
                                            <p className="text-sm text-gray-600 mb-2">{selectedFacility.type}</p>
                                        )}
                                        {selectedFacility.governor && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <span className="font-medium text-gray-600">Governor: </span>
                                                <span className="font-medium">{selectedFacility.governor}</span>
                                            </div>)}
                                        {selectedFacility.date && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <span className="font-medium text-gray-600">Date Proposed: </span>
                                                <span className="font-medium">{selectedFacility.date}</span>
                                            </div>)}
                                        <div className="mt-4">
                                            <Link href="/take-action"><button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm flex items-center">Take Action</button></Link>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>

                    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg overflow-hidden w-64">
                        <div className="bg-emerald-700 text-white px-4 py-3 flex justify-between items-center">
                            <h3 className="text-sm font-bold">Map Controls</h3>
                            <button
                                onClick={() => setLegendVisible(!legendVisible)}
                                className="text-white focus:outline-none"
                            >
                                {legendVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {legendVisible && (
                            <div className="px-4 py-3">
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Layers</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="mapLayer"
                                                checked={showSVI}
                                                onChange={() => {
                                                    setShowSVI(true);
                                                    setShowDemographic(false);
                                                }}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Social Vulnerability Index</span>
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
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Demographic Data</span>
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
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">No Data Layer</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Facility Markers</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showCurrentFacilities}
                                                onChange={(e) => setShowCurrentFacilities(e.target.checked)}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Existing Facilities</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showProposedFacilities}
                                                onChange={(e) => setShowProposedFacilities(e.target.checked)}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Proposed Facilities</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg overflow-hidden w-64">
                        <div className="bg-emerald-700 text-white px-4 py-3">
                            <h3 className="text-sm font-bold">Map Legend</h3>
                        </div>
                        <div className="p-4">
                            {showSVI && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Social Vulnerability Index</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-emerald-500 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">Low Vulnerability (0.00-0.25)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-amber-400 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">Medium Vulnerability (0.25-0.50)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-orange-500 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">High Vulnerability (0.50-0.75)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-red-500 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">Extremely High (0.75-1.00)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">No Data Available</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showDemographic && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Minority Population</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-blue-500 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">White Majority</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-purple-600 rounded mr-2"></div>
                                            <span className="text-xs text-gray-700">Minority Majority</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Facilities</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                        </div>
                                        <span className="text-xs text-gray-700">Existing Industrial Facility</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                        </div>
                                        <span className="text-xs text-gray-700">Proposed Industrial Facility</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="absolute top-4 left-4 z-20 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        Error loading data: {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-3 text-emerald-700 font-medium">Loading map data...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-5 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Understanding the Map</h3>
                            <p className="text-gray-600">This interactive map visualizes the relationship between environmental hazards and demographic data across the United States. Click on any county to see detailed information.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm flex items-center"
                                onClick={() => {
                                    const mapSection = document.getElementById('insights');
                                    if (mapSection) {
                                        mapSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <Link href="/about">Learn About Data Sources</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold">SVI Analysis</h3>
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-gray-600 mb-4">Social Vulnerability Index (SVI) indicates a community&apos;s capacity to respond to external stressors such as new pollutor in the community.</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Source: CDC/ATSDR</span>
                            <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition flex items-center">
                                <Link target="_blank" href="https://www.atsdr.cdc.gov/place-health/php/svi/index.html">Explore Data</Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold">Demographic Data</h3>
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-gray-600 mb-4">Population demographic data helps identify communities that may face disproportionate environmental burdens due to systemic inequalities.</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Source: U.S. Census Bureau</span>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition flex items-center">
                                <Link href="https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-detail.html" target="_blank">Explore Data</Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold">Industrial Facilities</h3>
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-gray-600 mb-4">Locations of existing and proposed industrial facilities that may impact local environmental quality and public health outcomes.</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Source: EPA</span>
                            <button className="text-amber-600 text-sm font-medium hover:text-amber-700 transition flex items-center">
                                <Link target="_blank" href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-dioxin-and-dioxin-compounds-and-teq-data-files-calendar">Explore Data</Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountyMap;