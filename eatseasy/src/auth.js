import axios from 'axios';
export const login = async (email, password) => {
  try {
      const response = await axios.post('http://localhost:8000/login', {
          email,
          password
      }, {
          withCredentials: true // This is crucial for cookies
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
  }
};

