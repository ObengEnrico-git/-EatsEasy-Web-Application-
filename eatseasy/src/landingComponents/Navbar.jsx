import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <div className="flex justify-between items-center h-24 text-white bg-[#2f855a] w-full px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img className="h-20" src="/logo192.png" alt="EatsEasy Logo" />
        <div className="font-sans text-lg font-bold">Meal Made Easier</div>
      </div>

      {/* Desktop Menu -- home and log in and sign up buttons */}
      <ul className="hidden md:flex items-center space-x-6">
        {isAuthenticated ? (
          <li>
            <button
              className="bg-[#13290C] text-white px-6 py-3 rounded-xl text-xl font-bold"
              onClick={() => navigate("/userProfile")}
            >
              Profile
            </button>
          </li>
        ) : (
          <>
            <li>
              <button
                className="text-white px-6 py-3 rounded-xl text-[25px] font-bold"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </li>
            <li>
              <button
                className="bg-[#13290C] text-white px-6 py-3 rounded-xl text-[25px] font-bold"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Menu Button -- burger icon and exit out icon */}
      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu -- slides out on the left */}
      <div
        className={`${
          nav ? "left-0" : "left-[-100%]"
        } fixed top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#4FC458] ease-in-out duration-500 md:hidden`}
      >
        <img className="h-12 m-4" src="/logo192.png" alt="EatsEasy Logo" />
        <ul className="pt-12 space-y-2 p-4">
          <li className="text-lg font-bold p-4 border-b-2">
            <Link to="/login">Log in</Link>
          </li>
          <li className="text-lg font-bold p-4 border-b-2">
            <Link to="/signup">Sign up</Link>
          </li>
          <li className="text-lg font-bold p-4">
            <Link to="/userProfile">Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
