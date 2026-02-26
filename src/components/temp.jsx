import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateEffect } from '../utils/helpers';

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

// 2. Posting History Dropdown Component
export const PostingHistoryDropdown = ({ jobId, lastPostedDate }) => {
  const dispatch = useDispatch();
  const postingList = useSelector(state => state.postingList)

  const [isOpen, setIsOpen] = useState(false);
  const [postings, setPostings] = useState([]);
  const [nextParams, setNextParams] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);


  useUpdateEffect(() => {
    // Only process if this response is for THIS specific job
    if (postingList?.data?.key === jobId) {
      if (postingList?.data?.status === 'success') {
        setPostings([...postings, ...postingList.data.body.results]);
        setLoading(false);
        setNextParams(postingList.data.body.next_param_object)
        setHasMore(!!postingList.data.body.next);
      } else if (postingList?.changingStatus !== 'ongoing') {
        if (postingList?.changingStatus === 'netFailed') {
          toast.error(postingList.data.message);
        } else if (postingList?.changingStatus === 'failed') {
          console.log(postingList)
          toast.error(postingList?.changingStatus);
        }
        setLoading(false);
      }
    }
  }, [postingList]);

  // const fetchPostings = async (cursor = null) => {
  //   setLoading(true);
  //   try {
  //     const cursorParam = cursor ? `&cursor=${cursor}` : '';
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/job/postings/?job=${jobId}${cursorParam}`);
  //     const data = await response.json();

  //     if (data && data.results) {
  //       setPostings(prev => cursor ? [...prev, ...data.results] : data.results);
  //       setNextCursor(data.next_param_object?.cursor?.[0] || null);
  //       setHasMore(!!data.next);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching postings:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      // Always fetch fresh data when opening
      setPostings([]);
      setNextParams({ job: jobId });
      dispatch({
        type: 'GET_POSTING_LIST',
        params: { job: jobId },
        key: jobId
      });
      setLoading(true);
    }
  }, [isOpen, jobId]);

  const handleScroll = (e) => {
    if (hasMore && !loading) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (Math.ceil(scrollTop) + Math.ceil(clientHeight) + 50 >= scrollHeight) {
        dispatch({
          type: 'GET_POSTING_LIST',
          params: nextParams,
          key: jobId
        });
      }
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = (e) => {
    let accordionButton = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
    accordionButton.setAttribute('data-bs-toggle', '');
  };

  const handleMouseLeave = (e) => {
    let accordionButton = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
    accordionButton.setAttribute('data-bs-toggle', 'collapse');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.posting-dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className="posting-dropdown-container"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <small
        className="text-muted"
        style={{
          cursor: 'pointer',
          color: '#0d6efd',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        onClick={toggleDropdown}
      >
        {moment(lastPostedDate).startOf('day').from(moment().startOf('day'))}
      </small>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            zIndex: 1000,
            width: '200px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            marginTop: '0.25rem'
          }}
          onScroll={handleScroll}
          onClick={(e) => e.stopPropagation()}
        >
          {postings.length === 0 && !loading ? (
            <div style={{ padding: '0.75rem', textAlign: 'center', color: '#6c757d' }}>
              No posting history
            </div>
          ) : (
            <div style={{ padding: '0.5rem 0' }}>
              {postings.map((posting, index) => (
                <div
                  key={posting.id || index}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: index < postings.length - 1 ? '1px solid #f0f0f0' : 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  {moment(posting.date).format('DD MMM, YYYY')}
                </div>
              ))}
              {loading && (
                <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// // 3. Status Dropdown Component
// export const StatusDropdown = ({ currentStatus, onStatusChange }) => {
//   const statuses = {
//     "IG": "Ignored",
//     "NA": "Not Applied",
//     "AF": "Applied",
//     "CR": "Call Received",
//     "IS": "Interview Scheduled",
//     "RP": "Response Pending",
//     "NE": "Negotiating",
//     "RE": "Rejected",
//     "OR": "Offer Received"
//   };

//   const handleChange = (e) => {
//     onStatusChange(e.target.value);
//   };

//   return (
//     <div>
//       <label className="form-label fw-bold">Status</label>
//       <select 
//         className="form-select" 
//         value={currentStatus} 
//         onChange={handleChange}
//       >
//         {Object.entries(statuses).map(([key, label]) => (
//           <option key={key} value={key}>{label}</option>
//         ))}
//       </select>
//     </div>
//   );
// };

// 3. Date Picker Component
// export const DatePicker = ({ label, value, onChange }) => {
//   return (
//     <div>
//       <label className="form-label fw-bold">{label}</label>
//       <input
//         type="date"
//         className="form-control"
//         value={value || ''}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// };

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

// // 5. Tech Stack Filter Component
// export const TechStackFilter = ({ selectedTechs, onSearch, onRemoveTech }) => {
//   const [searchValue, setSearchValue] = useState('');

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchValue(value);
//     onSearch(value);
//   };

//   return (
//     <div>
//       <label className="form-label">Tech Stack</label>
//       <input
//         type="text"
//         className="form-control"
//         placeholder="Search and select technologies..."
//         value={searchValue}
//         onChange={handleSearchChange}
//       />
//       <div className="tech-stack-container">
//         {selectedTechs.map((tech, index) => (
//           <span key={index} className="badge bg-primary selected-tech">
//             {tech}
//             <i 
//               className="bi bi-x-circle" 
//               style={{ cursor: 'pointer' }}
//               onClick={() => onRemoveTech(tech)}
//             ></i>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// // 6. Toast Notification Component
// export const Toast = ({ message, type = 'success', show, onClose }) => {
//   React.useEffect(() => {
//     if (show) {
//       const timer = setTimeout(onClose, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onClose]);

//   if (!show) return null;

//   const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';

//   return (
//     <div className="toast-container position-fixed bottom-0 end-0 p-3">
//       <div className={`toast show align-items-center ${bgClass} border-0`} role="alert">
//         <div className="d-flex">
//           <div className="toast-body">{message}</div>
//           <button 
//             type="button" 
//             className="btn-close btn-close-white me-2 m-auto" 
//             onClick={onClose}
//           ></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Usage Example:

// import { EditableField, StatusDropdown, DatePicker, ConfirmIgnoreButton, TechStackFilter, Toast } from './JobTrackerComponents';

function JobCard({ job }) {
  // const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'success' });

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
      {/*       
      <StatusDropdown 
        currentStatus={job.status} 
        onStatusChange={(val) => handleSaveField('status', val)} 
      />
      
      <DatePicker 
        label="Applied On" 
        value={job.applied_on} 
        onChange={(val) => handleSaveField('applied_on', val)} 
      /> */}

      <ConfirmIgnoreButton
        onConfirm={() => handleSaveField('status', 'IG')}
      />

      {/* <Toast 
        message={toastConfig.message} 
        type={toastConfig.type} 
        show={toastConfig.show} 
        onClose={() => setToastConfig({ ...toastConfig, show: false })} 
      /> */}
    </>
  );
}

export default JobCard;