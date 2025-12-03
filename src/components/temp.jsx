import React, { useState } from 'react';

// 1. Editable Field Component
export const EditableField = ({ label, value, onSave, disableIfValue = false, placeholder = "Not set" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [bufferValue, setBufferValue] = useState(value || '');

  const handleSave = () => {
    setInputValue(bufferValue);
    onSave(bufferValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(inputValue);
    setBufferValue(inputValue)
    setIsEditing(false);
  };
  
  return (
    <div>
      <label className="form-label fw-bold">{label}</label>
      <div className="input-group input-group-sm">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control form-control-sm"
              value={bufferValue}
              onChange={(e) => setBufferValue(e.target.value)}
              placeholder={placeholder}
            />
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              <i className="bi bi-check"></i> Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
              <i className="bi bi-x"></i> Cancel
            </button>
          </>
        ) : (
          <>
            <input 
              type="text" 
              class="form-control" 
              value={inputValue}
              placeholder={placeholder} 
              disabled>
            </input>
            {disableIfValue && value ? '' : <button 
              className="btn btn-sm btn-outline-primary" 
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>}
            
          </>
        )}
      </div>
    </div>
  );
};

// 2. Status Dropdown Component
export const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  const statuses = {
    "IG": "Ignored",
    "NA": "Not Applied",
    "AF": "Applied",
    "CR": "Call Received",
    "IS": "Interview Scheduled",
    "RP": "Response Pending",
    "NE": "Negotiating",
    "RE": "Rejected",
    "OR": "Offer Received"
  };

  const handleChange = (e) => {
    onStatusChange(e.target.value);
  };

  return (
    <div>
      <label className="form-label fw-bold">Status</label>
      <select 
        className="form-select" 
        value={currentStatus} 
        onChange={handleChange}
      >
        {Object.entries(statuses).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
};

// 3. Date Picker Component
export const DatePicker = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="form-label fw-bold">{label}</label>
      <input
        type="date"
        className="form-control"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// 4. Confirm Ignore Button Component
export const ConfirmIgnoreButton = ({ onConfirm, className = "btn btn-warning" }) => {
  const [confirmState, setConfirmState] = useState(false);

  const handleClick = () => {
    if (confirmState) {
      onConfirm();
      setConfirmState(false);
    } else {
      setConfirmState(true);
      // Reset after 3 seconds if not confirmed
      setTimeout(() => setConfirmState(false), 3000);
    }
  };

  return (
    <button 
      className={confirmState ? "btn btn-danger" : className}
      onClick={handleClick}
    >
      {confirmState ? (
        <>
          <i className="bi bi-exclamation-triangle"></i> Confirm Ignore?
        </>
      ) : (
        <>
          <i className="bi bi-x-circle"></i> Ignore
        </>
      )}
    </button>
  );
};

// 5. Tech Stack Filter Component
export const TechStackFilter = ({ selectedTechs, onSearch, onRemoveTech }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div>
      <label className="form-label">Tech Stack</label>
      <input
        type="text"
        className="form-control"
        placeholder="Search and select technologies..."
        value={searchValue}
        onChange={handleSearchChange}
      />
      <div className="tech-stack-container">
        {selectedTechs.map((tech, index) => (
          <span key={index} className="badge bg-primary selected-tech">
            {tech}
            <i 
              className="bi bi-x-circle" 
              style={{ cursor: 'pointer' }}
              onClick={() => onRemoveTech(tech)}
            ></i>
          </span>
        ))}
      </div>
    </div>
  );
};

// 6. Toast Notification Component
export const Toast = ({ message, type = 'success', show, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast show align-items-center ${bgClass} border-0`} role="alert">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

// Usage Example:

// import { EditableField, StatusDropdown, DatePicker, ConfirmIgnoreButton, TechStackFilter, Toast } from './JobTrackerComponents';

function JobCard({ job }) {
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'success' });

  const handleSaveField = async (field, value) => {
    // try {
    //   // Your PATCH API call here
    //   await patchJob(job.id, { [field]: value });
    //   setToastConfig({ show: true, message: 'Updated successfully!', type: 'success' });
    // } catch (error) {
    //   setToastConfig({ show: true, message: 'Update failed!', type: 'error' });
    // }
  };

  return (
    <>
      <EditableField 
        label="Recruiter" 
        value={job.recruiter} 
        onSave={(val) => handleSaveField('recruiter', val)} 
      />
      
      <StatusDropdown 
        currentStatus={job.status} 
        onStatusChange={(val) => handleSaveField('status', val)} 
      />
      
      <DatePicker 
        label="Applied On" 
        value={job.applied_on} 
        onChange={(val) => handleSaveField('applied_on', val)} 
      />
      
      <ConfirmIgnoreButton 
        onConfirm={() => handleSaveField('status', 'IG')} 
      />
      
      <Toast 
        message={toastConfig.message} 
        type={toastConfig.type} 
        show={toastConfig.show} 
        onClose={() => setToastConfig({ ...toastConfig, show: false })} 
      />
    </>
  );
}

export default JobCard;