import React from 'react';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const PrioritySelector = ({ value, onChange, small = false }) => (
  <div className={`priority-selector ${small ? 'small' : ''}`}>
    {PRIORITIES.map((p) => (
      <button
        key={p}
        type="button"
        className={`priority-btn ${p.toLowerCase()} ${value === p ? 'active' : ''}`}
        onClick={() => onChange(p)}
      >
        {p}
      </button>
    ))}
  </div>
);

export default PrioritySelector;
