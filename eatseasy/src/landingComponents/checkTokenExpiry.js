// useTokenExpiry.js
import { useState, useEffect } from "react";

const EXPIRY_TIME = 3600000; // 10 seconds for testing (replace with 3600000 for 1 hour)

// how to use class and explaination
//every 60 second runs instead of pinging the  backend this class check the last noted - current time login time 
// if the result is over 3600000 = 1 hour it will the navbars will change to reflect token has expried 
// more efficent than constant pings to backend
 
  //use (const isValid = useTokenExpiry(6000);) returns true and false

export const useTokenExpiry = (checkInterval = 6000) => {
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      // Get the login time from localStorage on every check
      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) {
        setIsTokenValid(false);
        return;
      }

      const now = Date.now();
      const elapsed = now - parseInt(loginTime, 10);

      if (elapsed >= EXPIRY_TIME) {
        // Remove the login time when expired and mark the token as invalid
        localStorage.removeItem("loginTime");
        setIsTokenValid(false);
      } else {
        setIsTokenValid(true);
      }
    };

    // Run the check immediately
    checkTokenExpiry();

    // Set up the interval to check repeatedly
    const intervalId = setInterval(checkTokenExpiry, checkInterval);

    // Cleanup: clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [checkInterval]); // Only depend on the checkInterval

  return isTokenValid;
};
