import { Box, Typography, Paper } from "@mui/material"
import { FitnessCenter, Height, DirectionsRun } from "@mui/icons-material"

const UserBmi = ({ bmiData }) => {
  if (!bmiData) return null

  return (
    <Box mb={12}>
      <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
        Your Health Profile
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
        </Box>
      </Paper>
    </Box>
  )
}

export default UserBmi;