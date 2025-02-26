import axios from 'axios';


//login authenticator
export const login = async (email, password) => {
  try {
      const response = await axios.post('http://localhost:8000/login', {
          email,
          password
      }, {
          withCredentials: true
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
  }
};

