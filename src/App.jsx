import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StoryboardPage from './pages/StoryboardPage'
import CutsPage from './pages/CutsPage'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/storyboards" replace />} />
            <Route path="/storyboards" element={<StoryboardPage />} />
            <Route path="/cuts" element={<CutsPage />} />
            <Route path="/settings" element={<div style={{ color: '#9ca3af', padding: '40px', textAlign: 'center' }}>Settings page coming soon.</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
