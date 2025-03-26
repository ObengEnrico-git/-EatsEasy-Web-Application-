import React from 'react';
import { useNavigate } from 'react-router-dom';
import NumberOne from '../images/number-1.webp';
import NumberTwo from '../images/number-2.webp';
import NumberThree from '../images/number-3.webp';

//lazy loading does not happen here

const Cards = () => {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/Bmi');
    }

    return (
        <div className='w-full py-[10rem] px-4 bg-white'>
            {/* Section Title */}
            <h1 className='text-center md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 mb-20 mt-[-8rem]'>
                How it Works
            </h1>

            {/* Container for Cards */}
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8'>

                {/* Step One Card */}
                <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src={NumberOne} alt="1" loading="lazy" />
                    <h2 className='text-2xl font-bold text-center py-8'>Calculate Your BMI</h2>
                    <p className='text-center font-bold'>Personalise Your Nutrition Journey</p>
                    <div className='text-center font-medium'>
                        <p className='py-2'>Begin by completing our BMI calculator to understand your unique body composition.</p>
                        <p className='py-2'>We use this information to craft nutrition plans tailored specifically to your needs and goals.</p>
                    </div>
                </div>

                {/* Step Two Card */}
                <div className='w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-transparent' src={NumberTwo} alt="2" loading="lazy" />
                    <h2 className='text-2xl font-bold text-center py-8'>Bespoke Meal Plans</h2>
                    <p className='text-center font-bold'>Nutrition Made Just For You</p>
                    <div className='text-center font-medium'>
                        <p className='py-2'>Our advanced algorithm generates custom meal plans based on your dietary preferences and nutritional requirements.</p>
                        <p className='py-2'>Each plan includes delicious, balanced recipes that help you achieve your health goals.</p>
                    </div>
                    <button onClick={handleGetStarted} className='bg-[#13290C] text-white w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>
                        Get Started
                    </button>
                </div>

                {/* Step Three Card */}
                <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src={NumberThree} alt="3" loading="lazy" />
                    <h2 className='text-2xl font-bold text-center py-8'>Create Your Account</h2>
                    <p className='text-center font-bold'>Unlock Premium Features</p>
                    <div className='text-center font-medium'>
                        <p className='py-2'>Sign up to save your favourite recipes, track your progress, and receive personalised recommendations.</p>
                        <p className='py-2'>Members enjoy exclusive access to our nutrition insights and meal planning tools.</p>
                    </div>
                    <button onClick={() => navigate('/signup')} className='bg-[#07853D] text-white w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>
                        Sign Up Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cards;
