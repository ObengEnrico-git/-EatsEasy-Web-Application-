import React from 'react'
import { Box, Typography, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../NavBar'

const NotLoggedIn = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
        gap={4}
      >
        <Box
          className="bg-[#fefbfb] text-black p-8 rounded-lg"
          sx={{ width: '100%' }}
        >
          <Typography variant="h4" className="mb-4 font-bold">
            Not Logged In
          </Typography>
          <Typography variant="body1" className="mb-6 text-black">
            Please log in to view your profile and access all features.
          </Typography>
          <button
            variant="contained"
            onClick={() => navigate('/login')}
            className="bg-[#1f9b48] hover:bg-[#194b34] text-white"
            size="large"
          >
            Go to Login
          </button>
          <br />
          <br />
          <Typography variant="body1" className="mb-6 text-black">
            Don't have an account? <Link to="/signup"> <u>Sign up</u></Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default NotLoggedIn