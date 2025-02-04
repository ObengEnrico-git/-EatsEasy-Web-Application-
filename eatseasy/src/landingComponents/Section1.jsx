import React from 'react'
import { ReactTyped } from "react-typed";

const Section1 = () => {
    return (
        <div
            className="text-white h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/foodimage1.jpg')" }}
        >
            <div className="max-w-[800px] mt-[-96] w-full h-full mx-auto text-center flex flex-col justify-center">
                <p className="font-bold p-2 text-[#07853D]">Welcome to EatsEasy</p>
                <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
                    Meals Made Easier
                </h1>

                {/* Wrapping only the ReactTyped and "Fast, easy meals for" in a flex container */}
                <div className="flex justify-center items-center">
                    <p className="md:text-5xl sm:text-4xl text-xl font-bold py-4 text-black">
                        Fast, easy meals for
                    </p>
                    <ReactTyped
                        className="md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2 text-black"
                        strings={["minimal fuss", "convenience", "busy days"]}
                        typeSpeed={120}
                        backSpeed={140}
                        loop
                    />
                </div>

                {/* Separate container for the text and button so they appear below */}
                <div>
                    <p className="md:text-2xl text-xl font-bold mt-4 text-[#07853D]">
                        Personalised meals made for you
                    </p>
                    <button className="bg-[#13290C] text-white w-[200px] rounded-md font-medium my-6 mx-auto py-3">
                        Get Started
                    </button>
                </div>
            </div>
        </div>


    )
}

export default Section1