import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function EducationManager({ educations }) {
    const dispatch = useDispatch();
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
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        start_date: '',
        end_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (edu) => {
        setEditId(edu.id);
        setFormData({
            institution: edu.institution,
            degree: edu.degree,
            start_date: edu.start_date || '',
            end_date: edu.end_date || ''
        });
        setIsEditing(true);
    };

    const handleAddNewClick = () => {
        setEditId(null);
        setFormData({
            institution: '',
            degree: '',
            start_date: '',
            end_date: ''
        });
        setIsEditing(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData, profile: profile?.id };
        if (!payload.end_date) payload.end_date = null;
        if (!payload.start_date) payload.start_date = null;

        if (editId) {
            dispatch({ type: 'UPDATE_EDUCATION', payload: payload, key: editId });
        } else {
            dispatch({ type: 'ADD_EDUCATION', payload: payload });
        }
        
        setIsEditing(false);
        setEditId(null);
        setFormData({ institution: '', degree: '', start_date: '', end_date: '' });
        setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this education?")) {
            dispatch({ type: 'DELETE_EDUCATION', key: id });
            setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Education</h5>
                {!isEditing && (
                    <button className="btn btn-sm btn-outline-primary" onClick={handleAddNewClick}>
                        <i className="bi bi-plus-lg"></i> Add New
                    </button>
                )}
            </div>
            
            {isEditing && (
                <div className="card-body bg-light border-bottom">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <input type="text" className="form-control form-control-sm" name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control form-control-sm" name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <input type="date" className="form-control form-control-sm" name="start_date" value={formData.start_date} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <input type="date" className="form-control form-control-sm" name="end_date" value={formData.end_date} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="text-end">
                            <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => { setIsEditing(false); setEditId(null); }}>Cancel</button>
                            <button type="submit" className="btn btn-sm btn-primary">{editId ? 'Update Education' : 'Save Education'}</button>
                        </div>
                    </form>
                </div>
            )}

            <ul className="list-group list-group-flush">
                {educations.length === 0 ? (
                    <li className="list-group-item text-muted text-center py-4">No education added.</li>
                ) : (
                    educations.map(edu => (
                        <li key={edu.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="mb-1">{edu.degree} at {edu.institution}</h6>
                                    <small className="text-muted d-block">
                                        {edu.start_date || 'Unknown'} - {edu.end_date || 'Present'}
                                    </small>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditClick(edu)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(edu.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default EducationManager;
