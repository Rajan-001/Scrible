import "./App.css"
import { Game } from "./Game/Game"
import { SocketProvider } from "./Hook/Socket"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LandingPage } from "./Page/Landing_Page"

function App() {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </div>
  )
}

export default App
