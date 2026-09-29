import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TechStackSelect from './TechStackSelect';
import BulletPointsManager from './BulletPointsManager';

function ProjectManager({ projects }) {
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
        name: '',
        description: '',
        link: '',
        tech_stacks: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTechStackChange = (newStacks) => {
        setFormData(prev => ({ ...prev, tech_stacks: newStacks }));
    };

    const handleEditClick = (proj) => {
        setEditId(proj.id);
        setFormData({
            name: proj.name,
            description: proj.description,
            link: proj.link || '',
            tech_stacks: proj.tech_stacks || []
        });
        setIsEditing(true);
    };

    const handleAddNewClick = () => {
        setEditId(null);
        setFormData({
            name: '',
            description: '',
            link: '',
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

        if (editId) {
            dispatch({ type: 'UPDATE_PROJECT', payload: payload, key: editId });
        } else {
            dispatch({ type: 'ADD_PROJECT', payload: payload });
        }
        
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', description: '', link: '', tech_stacks: [] });
        setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this project?")) {
            dispatch({ type: 'DELETE_PROJECT', key: id });
            setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Projects</h5>
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
                                <input type="text" className="form-control form-control-sm" name="name" placeholder="Project Name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <input type="url" className="form-control form-control-sm" name="link" placeholder="Project URL (optional)" value={formData.link} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-12">
                                <textarea className="form-control form-control-sm" name="description" placeholder="Description" rows="2" value={formData.description} onChange={handleChange} required></textarea>
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
                            <button type="submit" className="btn btn-sm btn-primary">{editId ? 'Update Project' : 'Save Project'}</button>
                        </div>
                    </form>
                </div>
            )}

            <ul className="list-group list-group-flush">
                {projects.length === 0 ? (
                    <li className="list-group-item text-muted text-center py-4">No projects added.</li>
                ) : (
                    projects.map(proj => (
                        <li key={proj.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 className="mb-1">
                                        {proj.name}
                                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="ms-2 small text-primary"><i className="bi bi-link-45deg"></i></a>}
                                    </h6>
                                    <p className="mb-1 small text-muted">{proj.description}</p>
                                    <div className="mt-2">
                                        {(proj.tech_stacks || []).map((tech, idx) => (
                                            <span key={idx} className="badge bg-secondary me-1">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditClick(proj)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(proj.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Bullet Points Section */}
                            <BulletPointsManager 
                                itemId={proj.id} 
                                itemType="PROJECT" 
                                bullets={proj.bullet_points} 
                            />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default ProjectManager;
