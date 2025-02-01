import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/Bmi');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner */}
            <div className="bg-green-800 text-white py-4 px-6 flex justify-between items-center">
                <img
                    src="/logo192.png"
                    alt="EatsEasy Logo"
                    className="h-8"
                />
                <div className="flex space-x-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded">
                        Log in
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded">
                        Register
                    </button>
                </div>
            </div>

            {/* Content with background image */}
            <div
                className="relative h-[600px] bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/foodimage1.jpg')`,
                }}
            >
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
                    <h2 className="text-4xl font-extrabold mb-4">Welcome to EatsEasy</h2>
                    <button
                        onClick={handleGetStarted}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md text-lg mt-4 w-auto"
                    >
                        Get started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
