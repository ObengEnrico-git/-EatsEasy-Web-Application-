import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTokenExpiry } from "./checkTokenExpiry"

const Navbar = ({ hideAuthButtons = false, hideProfileButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nav, setNav] = useState(false);
  const [username, setUsername] = useState("");
 

  const handleNav = () => {
    setNav(!nav);
  };

  const isAuthenticated = localStorage.getItem("token") !== null;

   //every 60 second runs instead of pinging the  backend check the last noted login time more efficent reduces the conditional rendering flickers 
 // check if 1 hour has passed since login every 60 sec
  const isValid = useTokenExpiry(6000);
  

  const hideauth = ["/Bmi"].includes(location.pathname);
  const hideProfile = ["/userProfile"].includes(location.pathname);

  // Ref for mobile menu container only
  const menuRef = useRef();

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


 

  useEffect(() => {
    //only runs when this component is loaded so do not need check local storage becuase it will load
    //  the pervious userName what the person login is different from pervious person logged in it will load the username of the pervious person
    const fetchUsername = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUsername(capitalizeFirstLetter(userData.username));
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [isAuthenticated]);

  useEffect(() => {
    // Clicking outside the mobile menu closes it
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setNav(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the token cookie
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        // Clear all user-related data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("status");
        localStorage.removeItem("bmi");
        localStorage.removeItem("weightGoal");
        localStorage.removeItem("weight");
        localStorage.removeItem("weightUnit");
        localStorage.removeItem("gender");
        localStorage.removeItem("height");
        localStorage.removeItem("heightUnit");
        localStorage.removeItem("age");
        localStorage.removeItem("optionPicked");
        localStorage.removeItem("diet");
        localStorage.removeItem("selectedAllergens");
        localStorage.removeItem("loginTime")

        // Redirect to the login page
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex justify-between items-center h-24 text-white bg-[#2f855a] w-full px-6">
      {/* Mobile Hamburger (visible on mobile only) */}
      <div className="block md:hidden">
        <div onClick={handleNav} className="cursor-pointer">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>

      {/* Logo (visible on desktop only) */}
      <div className="hidden md:flex items-center gap-2">
        <input
          type="image"
          className="h-20"
          src="/logo192.png"
          alt="EatsEasy Logo"
          onClick={() => {
            window.location.href = "/";
          }}
        />
        <a href="/" className="font-sans text-lg font-bold">
          Meal Made Easier
        </a>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center space-x-6">
        {isValid ? (
          !hideProfile && (
            <li>
              <button
                className="bg-[#13290C] text-white px-6 py-3 rounded-xl text-xl font-bold"
                onClick={() => navigate("/userProfile")}
              >
                Profile
              </button>
            </li>
          )
        ) : (
          <>
            {!hideauth && (
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
          </>
        )}
      </ul>

      {/* Mobile Menu (Slide-out) */}
      <div
        ref={menuRef}
        className={`${
          nav ? "left-0" : "left-[-100%]"
        } fixed top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#2f855a] ease-in-out duration-500 md:hidden z-50`}
      >
        {/* Mobile Menu Logo (optional, you can remove if you want hamburger only) */}
        <div className="text-center">
          <img
            className="h-20 m-4 mx-auto cursor-pointer"
            src="/logo192.png"
            alt="EatsEasy Logo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
          <a href="/" className="font-sans text-lg font-bold">
            Meal Made Easier
          </a>
        </div>

        <ul className="pt-12 space-y-2 p-4">
          {isValid  ? (
            !hideProfileButton && (
              <>
                <div className="text-center text-black text-4xl font-bold p-4 border-b-2">
                  Hello, <span className="username">{username}</span>
                </div>

                <li className="text-lg font-bold p-4 ">
                  <Link to="/userProfile">Profile</Link>
                </li>

                <li className="text-lg font-bold p-4 ">
                  <a href="/Bmi">BMI Calculator</a>
                </li>

                <li className="text-lg font-bold p-4 ">
                  <a href="/mealplan">Meal Plan</a>
                </li>

                <li className="text-lg font-bold p-4 ">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )
          ) : (
            <>
              {!hideAuthButtons && (
                <>
                  <li className="text-lg font-bold p-4 ">
                    <Link to="/login">Log in</Link>
                  </li>
                  <li className="text-lg font-bold p-4 ">
                    <Link to="/signup">Sign up</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
