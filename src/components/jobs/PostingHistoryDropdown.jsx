import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateEffect } from '../../utils/helpers';

const PostingHistoryDropdown = ({ jobId, lastPostedDate }) => {
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

export default PostingHistoryDropdown;
