import { Box, Button, HStack } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import ChallengePage from "./pages/ChallengePage.jsx"

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/challenge" element={<ChallengePage />}/>

      </Routes>
    </Box>
  )
}

export default App
