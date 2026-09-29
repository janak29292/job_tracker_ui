import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function TechStackSelect({ selectedStacks = [], onChange, label = "Tech Stacks" }) {
    const dispatch = useDispatch();
    const techStackList = useSelector(state => state.techStackList);
    const [stacks, setStacks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    // For hiding the dropdown when clicking outside
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getTechStackList = (techName) => {
        setInputValue(techName);
        dispatch({
            type: 'GET_TECHSTACK_LIST',
            params: { name__icontains: techName }
        });
        if (techName.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (techStackList?.data?.status === 'success') {
            setStacks(techStackList.data.body);
        } else if (techStackList?.changingStatus !== 'ongoing') {
            if (techStackList?.changingStatus === 'netFailed') {
                toast.error(techStackList.data.message);
            } else if (techStackList?.changingStatus === 'failed') {
                toast.error(techStackList?.changingStatus);
            }
        }
    }, [techStackList]);

    useEffect(() => {
        // Initial fetch for top technologies if clicked without typing
        if (isOpen && stacks.length === 0 && inputValue === '') {
            dispatch({ type: 'GET_TECHSTACK_LIST', params: {} });
        }
    }, [isOpen]);

    const addTech = (techName) => {
        if (!selectedStacks.includes(techName)) {
            onChange([...selectedStacks, techName]);
        }
        setInputValue('');
        setIsOpen(false);
    };

    const removeTech = (techName) => {
        onChange(selectedStacks.filter(item => item !== techName));
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold">{label}</label>
            <div className="dropdown tech-input-wrapper position-relative" ref={dropdownRef}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={e => getTechStackList(e.target.value)} 
                    onFocus={() => setIsOpen(true)}
                    className="form-control form-control-sm" 
                    placeholder="Search technologies..." 
                    autoComplete="off" 
                />
                
                {isOpen && stacks.length > 0 && (
                    <div className="dropdown-menu tech-dropdown show" style={{ position: 'absolute', width: '100%', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                        {stacks.filter(item => !selectedStacks.includes(item.name)).map((item) => (
                            <div key={item.id} className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => addTech(item.name)}>
                                <span className="badge bg-primary">{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="tech-stack-container mt-2 d-flex flex-wrap gap-1">
                {selectedStacks.map((item, index) => (
                    <span key={index} className="badge bg-primary d-flex align-items-center">
                        {item} 
                        <i 
                            className="bi bi-x-circle ms-1" 
                            onClick={() => removeTech(item)} 
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default TechStackSelect;
