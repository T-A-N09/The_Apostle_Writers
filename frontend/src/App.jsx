import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Home from "./pages/Home"
import Matthew from "./pages/Matthew"
import John from "./pages/John"
import Peter from "./pages/Peter"
import Paul from "./pages/Paul"
import Games from "./pages/Games"
import Signup from "./pages/Signup"
import Trivia from "./pages/Trivia"
import Hangman from "./pages/Hangman"
import Intro from "./pages/Intro"

import './Apostles.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>

      <Routes>  
        <Route path="/" element={<Intro />} />
        <Route path="/Home" element={<Home user={user} />} />
        <Route path="/Signup" element={<Signup setUser={setUser} />} />
        <Route path="/Matthew" element={<Matthew />} />
        <Route path="/John" element={<John />} />
        <Route path="/Peter" element={<Peter />} />
        <Route path="/Paul" element={<Paul />} />
        <Route path="/Games" element={<Games />} />
        <Route path="/Trivia" element={<Trivia />} />
        <Route path="/Hangman" element={<Hangman />} />
      </Routes>
    </Router>
  )
}

export default App