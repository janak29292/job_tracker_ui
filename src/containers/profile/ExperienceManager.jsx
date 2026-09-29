import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TechStackSelect from './TechStackSelect';
import BulletPointsManager from './BulletPointsManager';

function ExperienceManager({ experiences }) {
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
        company_name: '',
        job_title: '',
        start_date: '',
        end_date: '',
        is_current: false,
        tech_stacks: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTechStackChange = (newStacks) => {
        setFormData(prev => ({ ...prev, tech_stacks: newStacks }));
    };

    const handleEditClick = (exp) => {
        setEditId(exp.id);
        setFormData({
            company_name: exp.company_name,
            job_title: exp.job_title,
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            is_current: exp.is_current,
            tech_stacks: exp.tech_stacks || []
        });
        setIsEditing(true);
    };

    const handleAddNewClick = () => {
        setEditId(null);
        setFormData({
            company_name: '',
            job_title: '',
            start_date: '',
            end_date: '',
            is_current: false,
            tech_stacks: []
        });
        setIsEditing(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (profile?.id) {
            const currentCoreSkills = profile.core_skills || [];
            let addedNewSkill = false;
            const updatedCoreSkills = [...currentCoreSkills];
            
            formData.tech_stacks.forEach(tech => {
                if (!updatedCoreSkills.includes(tech)) {
                    updatedCoreSkills.push(tech);
                    addedNewSkill = true;
                }
            });

            if (addedNewSkill) {
                const submissionData = new FormData();
                submissionData.append('core_skills', JSON.stringify(updatedCoreSkills));
                dispatch({ type: 'UPDATE_PROFILE', payload: submissionData, key: profile.id });
            }
        }

        const payload = { ...formData, profile: profile?.id };
        if (!payload.end_date) payload.end_date = null;
        if (!payload.start_date) payload.start_date = null;

        if (editId) {
            dispatch({ type: 'UPDATE_EXPERIENCE', payload: payload, key: editId });
        } else {
            dispatch({ type: 'ADD_EXPERIENCE', payload: payload });
        }
        
        setIsEditing(false);
        setEditId(null);
        setFormData({ company_name: '', job_title: '', start_date: '', end_date: '', is_current: false, tech_stacks: [] });
        setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this experience?")) {
            dispatch({ type: 'DELETE_EXPERIENCE', key: id });
            setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Work Experience</h5>
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
                                <input type="text" className="form-control form-control-sm" name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control form-control-sm" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <input type="date" className="form-control form-control-sm" name="start_date" value={formData.start_date} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <input type="date" className="form-control form-control-sm" name="end_date" value={formData.end_date} onChange={handleChange} disabled={formData.is_current} />
                            </div>
                            <div className="col-md-4 d-flex align-items-center">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" name="is_current" id="is_current" checked={formData.is_current} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="is_current">I currently work here</label>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-12">
                                <TechStackSelect 
                                    selectedStacks={formData.tech_stacks} 
                                    onChange={handleTechStackChange} 
                                    label="Technologies Used" 
                                />
                            </div>
                        </div>
                        <div className="text-end">
                            <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => { setIsEditing(false); setEditId(null); }}>Cancel</button>
                            <button type="submit" className="btn btn-sm btn-primary">{editId ? 'Update Experience' : 'Save Experience'}</button>
                        </div>
                    </form>
                </div>
            )}

            <ul className="list-group list-group-flush">
                {experiences.length === 0 ? (
                    <li className="list-group-item text-muted text-center py-4">No work experience added.</li>
                ) : (
                    experiences.map(exp => (
                        <li key={exp.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 className="mb-1">{exp.job_title} at {exp.company_name}</h6>
                                    <small className="text-muted d-block">
                                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                                    </small>
                                    <div className="mt-2">
                                        {(exp.tech_stacks || []).map((tech, idx) => (
                                            <span key={idx} className="badge bg-secondary me-1">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditClick(exp)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Bullet Points Section */}
                            <BulletPointsManager 
                                itemId={exp.id} 
                                itemType="EXPERIENCE" 
                                bullets={exp.bullet_points} 
                            />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default ExperienceManager;
