// pages/dashboard.tsx
import type { NextPage } from 'next';
import CountyMap from '../components/map';

const Dashboard: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 relative">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-center">EcoJustice.ai Dashboard</h1>
            </header>
            <main>
                <CountyMap />
            </main>
        </div>
    );
};

export default Dashboard;