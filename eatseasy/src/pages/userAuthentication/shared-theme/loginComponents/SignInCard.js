import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
// For "Remember Me checkbox"
// import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
// For "Remember me checkbox"
// import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import NavBar from '../../../NavBar';
import axios from 'axios';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: '',
    message: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const isValid = validateInputs();
    
    if (!isValid) {
      return;
    }
    
    const emailInput = event.target.querySelector('#email');
    const passwordInput = event.target.querySelector('#password');

    if (!emailInput || !passwordInput) {
      console.error('Required form fields are missing');
      return;
    }

    const formData = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    try {
      const response = await axios.post('http://localhost:8000/login', formData);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.user.token);
      
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Successfully logged in'
      });

      // Navigate to user profile after successful login
      // This is a temporary route to test the profile page
      // TODO: Redirect to either user profile or BMI calculator? 
      navigate('/userprofile');
      
    } catch (error) {
      setAlertInfo({
        show: true,
        type: 'error',
        message: `Sign in failed: ${error.response?.data?.error || error.message}`
      });
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <>
      <Card variant="outlined">
        <NavBar />
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'baseline' }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          {/* Commented out Remember me as this is a "nice to have" feature */}
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <span>
              <Link
                href="/signup"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Facebook')}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={alertInfo.show && alertInfo.type === 'success'}
        autoHideDuration={6000}
        onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>Success</AlertTitle>
          {alertInfo.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={alertInfo.show && alertInfo.type === 'error'}
        autoHideDuration={6000}
        onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>Error</AlertTitle>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
}