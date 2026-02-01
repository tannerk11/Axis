import './ViewToggle.css';

function ViewToggle({ activeView, onViewChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${activeView === 'table' ? 'active' : ''}`}
        onClick={() => onViewChange('table')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
        Table
      </button>
      <button
        className={`view-toggle-btn ${activeView === 'visualizations' ? 'active' : ''}`}
        onClick={() => onViewChange('visualizations')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Visualizations
      </button>
    </div>
  );
}

export default ViewToggle;
