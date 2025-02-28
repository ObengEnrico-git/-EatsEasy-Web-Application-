import { Box, Typography, Paper, Chip } from "@mui/material"
import { FitnessCenter, Height, DirectionsRun } from "@mui/icons-material"
import BmiTimeline from './BmiTimeline'

const UserBmi = ({ bmiData, bmiHistory }) => {
  
  if (!bmiData) return null;

  return (
    <>
      <Box mb={12}>
        <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
          Current Health Profile
        </Typography>
        <Paper className="p-6 bg-white rounded-lg shadow-md">
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
            <Box className="flex flex-col items-center p-4 bg-[#f5f7f5] rounded-lg">
              <FitnessCenter className="text-[#2d6a4f] mb-2" fontSize="large" />
              <Typography variant="h6" className="font-bold text-[#1b4332]">
                Weight
              </Typography>
              <Typography variant="body1">
                {`${bmiData.weight} ${bmiData.weight_unit}`}
              </Typography>
            </Box>

            <Box className="flex flex-col items-center p-4 bg-[#f5f7f5] rounded-lg">
              <Height className="text-[#2d6a4f] mb-2" fontSize="large" />
              <Typography variant="h6" className="font-bold text-[#1b4332]">
                Height
              </Typography>
              <Typography variant="body1">
                {`${bmiData.height} ${bmiData.height_unit}`}
              </Typography>
            </Box>

            <Box className="flex flex-col items-center p-4 bg-[#f5f7f5] rounded-lg">
              <DirectionsRun className="text-[#2d6a4f] mb-2" fontSize="large" />
              <Typography variant="h6" className="font-bold text-[#1b4332]">
                Activity Level
              </Typography>
              <Typography variant="body1">
                {bmiData.activity_level}
              </Typography>
            </Box>
          </Box>

          <Box className="mt-6 p-4 bg-[#f5f7f5] rounded-lg">
            <Typography variant="body1" className="text-center text-[#1b4332]">
              <span className="font-bold">Profile:</span> {bmiData.gender}, {bmiData.age} years old
            </Typography>
            {bmiData.calculated_bmi && (
              <Typography variant="h5" className="text-center mt-2 font-bold" 
                sx={{ color: getBmiColor(bmiData.calculated_bmi) }}>
                Current BMI: {bmiData.calculated_bmi} - {bmiData.bmi_status}
              </Typography>
            )}
          </Box>

          {bmiData.diet_preferences && bmiData.diet_preferences.length > 0 && (
            <Box className="mt-6 p-4 bg-[#f5f7f5] rounded-lg">
              <Typography variant="h6" className="font-bold text-[#1b4332] mb-2">
                Diet Preferences
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {bmiData.diet_preferences.map((diet, index) => (
                  <Chip 
                    key={index}
                    label={diet}
                    className="bg-[#2d6a4f] text-white"
                  />
                ))}
              </Box>
            </Box>
          )}

          {bmiData.intolerances && bmiData.intolerances.length > 0 && (
            <Box className="mt-6 p-4 bg-[#f5f7f5] rounded-lg">
              <Typography variant="h6" className="font-bold text-[#1b4332] mb-2">
                Intolerances
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {bmiData.intolerances.map((intolerance, index) => (
                  <Chip 
                    key={index}
                    label={intolerance}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* BMI History Timeline */}
      <BmiTimeline bmiHistory={bmiHistory} />
    </>
  )
}

const getBmiColor = (bmi) => {
  if (bmi < 18.5) return '#3b82f6'; // Underweight - blue
  if (bmi < 24.9) return '#22c55e'; // Normal - green
  if (bmi < 29.9) return '#eab308'; // Overweight - yellow
  return '#ef4444'; // Obese - red
};

export default UserBmi;