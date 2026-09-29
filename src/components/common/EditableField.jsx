import React, { useState } from 'react';

const EditableField = ({ label, value, onSave, disableIfValue = false, placeholder = "Not set" }) => {
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

export default EditableField;
