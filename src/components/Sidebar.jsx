import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Technical Curator</div>
      <nav className="sidebar-nav">
        <NavLink to="/storyboards" className={({ isActive }) => isActive ? 'active' : ''}>
          <span>&#x229E;</span> Storyboards
        </NavLink>
        <NavLink to="/cuts" className={({ isActive }) => isActive ? 'active' : ''}>
          <span>&#x25CE;</span> Cuts
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
          <span>&#x2699;</span> Settings
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <a href="#help">
          <span>?</span> Help
        </a>
        <button type="button">
          <span>&#x2192;</span> Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
