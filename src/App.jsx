import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import EventDetail from "./pages/EventDetail.jsx"
import NotFound from "./pages/NotFound.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
