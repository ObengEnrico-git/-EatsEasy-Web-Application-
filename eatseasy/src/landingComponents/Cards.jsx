import React from 'react';
import { useNavigate } from 'react-router-dom';
import NumberOne from '../images/number-1.png';
import NumberTwo from '../images/number-2.png';
import NumberThree from '../images/number-3.png';

const Cards = () => {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/Bmi');
    }

    return (
        <div className='w-full py-[10rem] px-4 bg-white'>
            {/* Section Title */}
            <h1 className='text-center md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 mb-20 mt-[-8rem]'>
                How it all works
            </h1>

            {/* Container for Cards */}
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8'>

                {/* Step One Card */}
                <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src={NumberOne} alt="1" />
                    <h2 className='text-2xl font-bold text-center py-8'>Step One</h2>
                    <p className='text-center font-bold'>This is how step one works</p>
                    <div className='text-center font-medium'>
                        <p>More example text, blah blah</p>
                    </div>
                    <button onClick={handleGetStarted} className='w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>
                        Get Started
                    </button>
                </div>

                {/* Step Two Card */}
                <div className='w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-transparent' src={NumberTwo} alt="2" />
                    <h2 className='text-2xl font-bold text-center py-8'>Step Two</h2>
                    <p className='text-center font-bold'>This is how step two works</p>
                    <div className='text-center font-medium'>
                        <p>More example text, blah blah</p>
                    </div>
                    <button onClick={handleGetStarted} className='bg-[#13290C] text-white w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>
                        Get Started
                    </button>
                </div>

                {/* Step Three Card */}
                <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src={NumberThree} alt="3" />
                    <h2 className='text-2xl font-bold text-center py-8'>Step Three</h2>
                    <p className='text-center font-bold'>This is how step three works</p>
                    <div className='text-center font-medium'>
                        <p>More example text, blah blah</p>
                    </div>
                    <button onClick={handleGetStarted} className='w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cards;
