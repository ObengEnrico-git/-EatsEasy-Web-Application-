import React, { useState } from 'react';
import Navbar from '../landingComponents/Navbar';
import { useNavigate } from 'react-router-dom';
import Section1 from '../landingComponents/Section1';

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Section1 />
        </div>
    )
};

export default LandingPage;
