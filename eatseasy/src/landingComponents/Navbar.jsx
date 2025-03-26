import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        // Check if user is authenticated by looking for token in localStorage
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleNav = () => {
        setNav(!nav);
    };

    const handleHomeHover = () => {
      setIsHovered(!isHovered);
    };



    return (
        <div className='flex justify-between items-center h-24 text-white bg-[#07853D] w-full px-6'>
            {/* Logo */}
            <img className='h-12' src="/logo192.png" alt="EatsEasy Logo" />

            {/* Desktop Menu -- conditional rendering based on authentication */}
            <ul className='hidden md:flex items-center space-x-6'>
                <li 
                    className='text-lg font-bold' 
                    onClick={() => navigate("/")} 
                    onMouseEnter={handleHomeHover} 
                    onMouseLeave={handleHomeHover} 
                    style={{ 
                        fontWeight: isHovered ? 'bold' : 'normal',
                        textDecoration: isHovered ? 'underline' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    Home
                </li>
                
                {isAuthenticated ? (
                    // Menu items for authenticated users
                    <button className='bg-[#13290C] text-white px-4 py-2 rounded-md' onClick={() => navigate("/userprofile")}>Profile</button>

                ) : (
                    // Menu items for non-authenticated users
                    <>
                        <li>
                            <button className='bg-[#13290C] text-white px-4 py-2 rounded-md' onClick={() => navigate("/login")}>Log in</button>
                        </li>
                        <li>
                            <button className='bg-[#13290C] text-white px-4 py-2 rounded-md' onClick={() => navigate("/signup")}>Sign up</button>
                        </li>
                    </>
                )}
            </ul>

            {/* Mobile Menu Button -- burger icon and exit out icon */}
            <div onClick={handleNav} className='block md:hidden cursor-pointer'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Menu -- slides out on the left */}
            <div className={`${nav ? 'left-0' : 'left-[-100%]'} fixed top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#4FC458] ease-in-out duration-500 md:hidden`}>
                <img className='h-12 m-4' src="/logo192.png" alt="EatsEasy Logo" />
                <ul className='pt-12 space-y-2 p-4'>
                    <li className='text-lg font-bold p-4 border-b-2' onClick={() => navigate("/")}>Home</li>
                    
                    {isAuthenticated ? (
                        // Mobile menu items for authenticated users
                        <li className='text-lg font-bold p-4 border-b-2' onClick={() => navigate("/profile")}>Profile</li>
                    ) : (
                        // Mobile menu items for non-authenticated users
                        <>
                            <li className='text-lg font-bold p-4 border-b-2' onClick={() => navigate("/login")}>Log in</li>
                            <li className='text-lg font-bold p-4' onClick={() => navigate("/signup")}>Sign up</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
