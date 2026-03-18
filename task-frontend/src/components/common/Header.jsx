import React from 'react';

const Header = ({ view, onBack }) => {
  return (
    <header>
      <div className="header-title" onClick={onBack} style={{ cursor: 'pointer' }}>
        <h1>Task Tracker</h1>
        {view === 'detail' && <span className="view-badge">Detail View</span>}
      </div>
      <div className="header-actions">
        {view === 'detail' && (
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
