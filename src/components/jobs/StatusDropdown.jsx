import React, { useState, useEffect } from 'react';
import { JOB_STATUS } from '../../utils/constants';

const StatusDropdown = ({ currentStatus, onSave }) => {
  const [bufferValue, setBufferValue] = useState(currentStatus);
  const [showAll, setShowAll] = useState(false);

  // Sync bufferValue if currentStatus changes from outside (e.g. successful API response)
  useEffect(() => {
    setBufferValue(currentStatus);
  }, [currentStatus]);

  // Derive the options to display
  let availableStatuses = [];
  if (showAll) {
    availableStatuses = Object.keys(JOB_STATUS);
  } else {
    availableStatuses = JOB_STATUS[currentStatus]?.options || [];
    // Ensure the currentStatus is in the list (in case something went weird)
    if (!availableStatuses.includes(currentStatus)) {
        availableStatuses.unshift(currentStatus);
    }
  }

  const handleSave = () => {
    onSave(bufferValue);
  };

  const handleCancel = () => {
    setBufferValue(currentStatus);
  };

  const isChanged = bufferValue !== currentStatus;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label className="form-label fw-bold mb-0">Status</label>
        <div className="form-check form-switch mb-0" style={{ fontSize: '0.8rem', minHeight: 'auto' }}>
          <input 
            className="form-check-input" 
            type="checkbox" 
            id={`showAllToggle-${currentStatus}`} 
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            style={{ marginTop: '0.1rem' }}
          />
          <label className="form-check-label text-muted" htmlFor={`showAllToggle-${currentStatus}`}>Show all</label>
        </div>
      </div>
      <div className="input-group input-group-sm">
        <select 
          className="form-select" 
          value={bufferValue} 
          onChange={(e) => setBufferValue(e.target.value)}
        >
          {availableStatuses.map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {JOB_STATUS[statusKey]?.text || statusKey}
            </option>
          ))}
        </select>
        {isChanged && (
          <>
            <button className="btn btn-success" onClick={handleSave} title="Save Status">
              <i className="bi bi-check"></i>
            </button>
            <button className="btn btn-secondary" onClick={handleCancel} title="Cancel">
              <i className="bi bi-x"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;
