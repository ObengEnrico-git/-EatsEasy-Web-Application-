import React from "react";
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Card from "@mui/material/Card";

import Button from "@mui/material/Button";


const Section1 = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Bmi");
  };

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href="/images/foodimage1.webp" />
      </Helmet>
      <div
        className="text-white h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/foodimage1.webp')" }}
      >
        <div className="max-w-[800px] mt-[-96] w-full h-full mx-auto text-center flex flex-col justify-center">
          <p className="font-sans md:text-3xl font-bold text-black mb-10">
            Personalised meals made for you
          </p>
          
          <Card >
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
          </Card>
          

          {/* Separate container for the text and button so they appear below */}
          <div>
            <Button
              onClick={handleGetStarted}
              variant="contained"
              sx={{
                mt: "25px",
                backgroundColor: "#13290C",
                width: "200px",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderRadius: "15px",
                padding: "12px 0",
                "&:hover": {
                  backgroundColor: "FFFFFF",
                },
              }}
              aria-label="Get started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Section1;
