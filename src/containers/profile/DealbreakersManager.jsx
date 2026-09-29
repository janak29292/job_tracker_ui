import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DealbreakersManager() {
    const dispatch = useDispatch();
    const dealbreakersState = useSelector(state => state.dealbreaker);
    let dealbreakers = [];
    if (Array.isArray(dealbreakersState?.data)) {
        dealbreakers = dealbreakersState.data;
    } else if (Array.isArray(dealbreakersState?.data?.results)) {
        dealbreakers = dealbreakersState.data.results;
    } else if (Array.isArray(dealbreakersState?.data?.body)) {
        dealbreakers = dealbreakersState.data.body;
    }
    
    const profileState = useSelector(state => state.applicantProfile);
    let profile = {};
    if (profileState?.data?.status === 'success') {
        const body = profileState.data.body;
        if (Array.isArray(body)) {
            profile = body.length > 0 ? body[0] : {};
        } else if (body && Array.isArray(body.results)) {
            profile = body.results.length > 0 ? body.results[0] : {};
        } else {
            profile = body || {};
        }
    }
    
    const [newPhrase, setNewPhrase] = useState('');
    const [editingDealbreakerId, setEditingDealbreakerId] = useState(null);
    const [editPhrase, setEditPhrase] = useState('');

    useEffect(() => {
        dispatch({ type: 'GET_DEALBREAKER' });
    }, [dispatch]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newPhrase.trim()) return;
        dispatch({ type: 'ADD_DEALBREAKER', payload: { phrase: newPhrase, is_active: true, profile: profile?.id } });
        setNewPhrase('');
        // Quick reload after brief pause to allow backend sync
        setTimeout(() => dispatch({ type: 'GET_DEALBREAKER' }), 300);
    };

    const handleToggle = (id, currentStatus) => {
        dispatch({ type: 'UPDATE_DEALBREAKER', key: id, payload: { is_active: !currentStatus } });
        setTimeout(() => dispatch({ type: 'GET_DEALBREAKER' }), 300);
    };

    const handleEditClick = (db) => {
        setEditingDealbreakerId(db.id);
        setEditPhrase(db.phrase);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editPhrase.trim()) return;
        dispatch({ type: 'UPDATE_DEALBREAKER', key: editingDealbreakerId, payload: { phrase: editPhrase } });
        setEditingDealbreakerId(null);
        setTimeout(() => dispatch({ type: 'GET_DEALBREAKER' }), 300);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this dealbreaker?")) {
            dispatch({ type: 'DELETE_DEALBREAKER', key: id });
            setTimeout(() => dispatch({ type: 'GET_DEALBREAKER' }), 300);
        }
    };

    return (
        <div className="card shadow-sm mb-4 border-0" style={{ borderLeft: '4px solid #dc3545' }}>
            <div className="card-header bg-white">
                <h5 className="mb-0 text-danger">Strict Dealbreakers</h5>
                <small className="text-muted">Jobs matching these phrases will be instantly rejected by the AI.</small>
            </div>
            
            <div className="card-body bg-light p-0">
                <div className="p-3 border-bottom bg-white">
                    <form onSubmit={handleAdd} className="d-flex">
                        <input 
                            type="text" 
                            className="form-control form-control-sm me-2" 
                            placeholder="e.g. 'Security Clearance', 'US Citizen Only', 'Hybrid'" 
                            value={newPhrase} 
                            onChange={(e) => setNewPhrase(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="btn btn-sm btn-danger text-nowrap">
                            <i className="bi bi-plus-lg"></i> Add Dealbreaker
                        </button>
                    </form>
                </div>

                <ul className="list-group list-group-flush">
                    {dealbreakers.length === 0 ? (
                        <li className="list-group-item text-muted text-center py-4 bg-transparent border-0">No dealbreakers configured.</li>
                    ) : (
                        dealbreakers.map(db => (
                            <li key={db.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                                {editingDealbreakerId === db.id ? (
                                    <form onSubmit={handleSaveEdit} className="d-flex w-100">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm me-2" 
                                            value={editPhrase} 
                                            onChange={(e) => setEditPhrase(e.target.value)} 
                                            required 
                                        />
                                        <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setEditingDealbreakerId(null)}>Cancel</button>
                                        <button type="submit" className="btn btn-sm btn-success">Save</button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            <span className={`badge ${db.is_active ? 'bg-danger' : 'bg-secondary'} me-2`}>
                                                {db.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                            <span className={!db.is_active ? 'text-decoration-line-through text-muted' : ''}>
                                                {db.phrase}
                                            </span>
                                        </div>
                                        <div>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2" 
                                                onClick={() => handleEditClick(db)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-secondary me-2" 
                                                onClick={() => handleToggle(db.id, db.is_active)}
                                            >
                                                {db.is_active ? 'Disable' : 'Enable'}
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(db.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default DealbreakersManager;
