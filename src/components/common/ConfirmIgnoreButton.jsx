import React, { useState } from 'react';

const ConfirmIgnoreButton = ({ onConfirm, className = "btn btn-warning" }) => {
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

export default ConfirmIgnoreButton;
