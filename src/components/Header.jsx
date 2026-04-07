function Header() {
  return (
    <header className="header">
      <div className="header-title">STORYBOARD ENGINE</div>
      <div className="header-spacer" />
      <div className="header-search">
        <span className="header-search-icon">&#x1F50D;</span>
        <input type="text" placeholder="Search panels..." />
      </div>
      <div className="header-icons">
        <button className="header-icon-btn" title="Notifications">
          &#x1F514;
        </button>
        <button className="header-icon-btn" title="History">
          &#x1F553;
        </button>
        <div className="header-avatar" title="User">U</div>
      </div>
    </header>
  )
}

export default Header
