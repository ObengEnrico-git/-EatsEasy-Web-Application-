import { useState, useEffect } from "react"
import {
  Avatar,
  Typography,
  Box,
  Container,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import Navbar from "../NavBar"
import NotLoggedIn from "./NotLoggedIn"
import FavoriteMealPlans from "./FavoriteMealPlans"
import FavoriteRecipes from "./FavouriteRecipes"
import UserBmi from "./UserBmi"
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';

const UserProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token')
  })
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [yourMealPlans, setYourMealPlans] = useState([])
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [bmiData, setBmiData] = useState(null)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Fetch the user's profile data
      // If the user is not authenticated, set the isAuthenticated state to false

      try {
        const response = await fetch('http://localhost:8000/user/profile', {
          headers: {
            // If the user is authenticated, set the isAuthenticated state to true
            // Authorization header is set with the token
            // Bearer is the prefix for the token
            'Authorization': `Bearer ${token}`
          }
        })

        // If the user is not authenticated, set the isAuthenticated state to false
        if (!response.ok) {
          throw new Error('Authentication failed')
        }

        // If the user is authenticated, set the isAuthenticated state to true
        const userData = await response.json()
        // Set the user's profile data to the user state
        setUser(userData)
        // Set the isAuthenticated state to true
        setIsAuthenticated(true)
      } catch (error) {
        // If there is an error, remove the token from the local storage
        // Set the isAuthenticated state to false
        console.error('Auth error:', error)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      } finally {
        // Finally, set the isLoading state to false
        setIsLoading(false)
      }
    }

    // Check if the user is authenticated
    checkAuth()
  }, [])

  const handleLogout = async () => {
    // Set the openBackdrop state to true
    setOpenBackdrop(true)
    
    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))


    // Remove the token from the local storage
    localStorage.removeItem('token')
    // Set the openBackdrop state to false
    setOpenBackdrop(false)
    // Set the showLogoutAlert state to true
    setShowLogoutAlert(true)
    
    // Navigate after a brief delay to show the alert
    setTimeout(() => {
      // Navigate to the login page
      navigate('/login')
      // 1000 milliseconds = 1 second
    }, 1000)
  }

  const handleRecipeClick = (recipeId) => {
    // Navigate to the recipe page
    // recipeId is the id of the recipe to navigate to
    // If the user clicks on a recipe, the user will be navigated to the recipe page
    // The /recipe/:id is the route for the recipe page which is not implemented yet
    navigate(`/recipe/${recipeId}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      // token is the token from the local storage and we are using it to fetch the users token
      const token = localStorage.getItem('token')
      // Set the isLoading state to true
      setIsLoading(true)
      try {
        // mealPlansRes, favoritesRes, bmiRes are the responses from the meal plans, favorites and bmi data
        // All these endpoints are not implemented yet
        // TODO: Implement the endpoints within index.js
        // Could make a new file for the process of fetching the data (like how we have auth.js for the authentication process)

        const [mealPlansRes, favoritesRes, bmiRes] = await Promise.all([
          // mealPlansRes is the response from the meal plans data
          // The endpoint is not implemented yet
          // TODO: Implement the endpoint within index.js
          fetch('http://localhost:8000/user/meal-plans', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          // favoritesRes is the response from the favorites data
          // The endpoint is not implemented yet
          // TODO: Implement the endpoint within index.js
          fetch('http://localhost:8000/user/favorite-recipes', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          // bmiRes is the response from the bmi data
          // The endpoint is not implemented yet
          // TODO: Implement the endpoint within index.js
          fetch('http://localhost:8000/user/bmi-data', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        // mealPlans, favorites, bmi are the meal plans, favorites and bmi data
        const [mealPlans, favorites, bmi] = await Promise.all([
          // mealPlans is the meal plans data
          // The response is not implemented yet
          // TODO: Implement the response within index.js
          mealPlansRes.json(),
          // favorites is the favorites data
          // The response is not implemented yet
          // TODO: Implement the response within index.js
          favoritesRes.json(),
          // bmi is the bmi data
          // The response is not implemented yet
          // TODO: Implement the response within index.js
          bmiRes.json()
        ])

        // Set the meal plans to the meal plans state
        setYourMealPlans(mealPlans)
        // Set the favorites to the favorites state
        setFavoriteRecipes(favorites)
        // Set the bmi to the bmi state
        setBmiData(bmi)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // If the user is authenticated, fetch the data
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f7f5]">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <Typography>Loading...</Typography>
        </div>
      </div>
    )
  }

  // If the user is not authenticated, return the NotLoggedIn component
  if (!isAuthenticated) { 
    return <NotLoggedIn />
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <Navbar />
      <div className="bg-[#1b4332] text-white">
        <Container maxWidth="lg">
          <Box className="py-16 px-4">
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
              {/* Profile section */}
              <Box flex={1}>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'flex-start' }} gap={4}>
                  <Avatar
                    src={user?.avatar || "/placeholder.svg?height=120&width=120"}
                    className="w-24 h-24 md:w-28 md:h-28 border-4 border-[#2d6a4f] transform transition-transform hover:scale-105"
                  />
                  <div className="flex flex-col gap-2 text-center md:text-left">
                    <Typography variant="h3" className="font-bold mb-2 text-2xl md:text-3xl">
                      {user?.username || 'Loading...'}
                    </Typography>
                    <Typography variant="h6" className="text-green-200 text-sm md:text-base">
                      EatsEasy user since{' '}
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('en-UK', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : '...'}
                    </Typography>
                    <Typography className="text-green-100 mb-4 text-sm md:text-base">
                      {user?.email || 'Loading...'}
                    </Typography>
                    {/* Simplified buttons with hover animations */}
                    <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-start">
                      <button
                        onClick={() => navigate('/bmi')}
                        className="px-6 py-2 bg-white text-black rounded-lg transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-105 active:scale-95 w-full sm:w-auto"
                      >
                        BMI Calculator
                      </button>

                      <button
                        onClick={() => navigate('/mealplan')}
                        className="px-6 py-2 bg-white text-black rounded-lg transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-105 active:scale-95 w-full sm:w-auto"
                      >
                        Meal Plans
                      </button>
                    </div>
                  </div>
                </Box>
              </Box>
              {/* Compact logout button with hover expansion */}
              <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} mt={{ xs: 4, md: 0 }}>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-105 active:scale-95 w-[40px] h-[40px] hover:w-[110px] overflow-hidden"
                >
                  <LogoutIcon className="min-w-[24px]" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Logout
                  </span>
                </button>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>

      <Container maxWidth="lg" className="py-12">
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          // If the data is loaded, return the UserBmi, FavoriteMealPlans and FavoriteRecipes components
          <>
            <UserBmi bmiData={bmiData} />
            <FavoriteMealPlans 
              mealPlans={yourMealPlans}
              onHover={setHoveredCard}
              hoveredCard={hoveredCard}
              onMealPlanClick={handleRecipeClick}
            />
            <FavoriteRecipes 
              recipes={favoriteRecipes}
              onHover={setHoveredCard}
              hoveredCard={hoveredCard}
              onRecipeClick={handleRecipeClick}
            />
          </>
        )}
      </Container>

      {/* Logout Alert */}
      <Snackbar
        open={showLogoutAlert}
        autoHideDuration={1100}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          icon={<CheckIcon fontSize="inherit" />} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Successfully logged out
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)' 
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default UserProfile;