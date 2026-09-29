import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TechStackSelect from './TechStackSelect';

function BasicInfoForm({ profile }) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        designation: '',
        phone_number: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        summary: '',
        years_of_experience: 0,
        current_location: '',
        preferred_locations: '', // string for input, parsed on submit
        last_job_location: '',
        willingness_to_relocate: false,
        current_salary_fixed: 0,
        current_salary_variable: 0,
        expected_salary: 0,
        currency: 'USD',
        notice_period_days: 30,
        work_authorization: '',
        core_skills: []
    });

    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                middle_name: profile.middle_name || '',
                last_name: profile.last_name || '',
                email: profile.email || '',
                designation: profile.designation || '',
                phone_number: profile.phone_number || '',
                linkedin_url: profile.linkedin_url || '',
                github_url: profile.github_url || '',
                portfolio_url: profile.portfolio_url || '',
                summary: profile.summary || '',
                years_of_experience: profile.years_of_experience ?? 0,
                current_location: profile.current_location || '',
                preferred_locations: (profile.preferred_locations || []).join(', '),
                last_job_location: profile.last_job_location || '',
                willingness_to_relocate: profile.willingness_to_relocate || false,
                current_salary_fixed: profile.current_salary_fixed ?? 0,
                current_salary_variable: profile.current_salary_variable ?? 0,
                expected_salary: profile.expected_salary ?? 0,
                currency: profile.currency || 'USD',
                notice_period_days: profile.notice_period_days ?? 30,
                work_authorization: profile.work_authorization || '',
                core_skills: profile.core_skills || []
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setResumeFile(files[0]);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleTechStackChange = (newStacks) => {
        setFormData(prev => ({ ...prev, core_skills: newStacks }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submissionData = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key === 'preferred_locations') {
                const locationsArray = formData[key].split(',').map(s => s.trim()).filter(Boolean);
                submissionData.append(key, JSON.stringify(locationsArray));
            } else if (key === 'core_skills') {
                submissionData.append(key, JSON.stringify(formData[key]));
            } else {
                submissionData.append(key, formData[key]);
            }
        });

        // Append file if selected
        if (resumeFile) {
            submissionData.append('master_resume', resumeFile);
        }

        if (profile?.id) {
            dispatch({ type: 'UPDATE_PROFILE', payload: submissionData, key: profile.id });
        } else {
            dispatch({ type: 'CREATE_PROFILE', payload: submissionData });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Basic Information</h5>
                {!isEditing && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(true)}>
                        <i className="bi bi-pencil"></i> Edit
                    </button>
                )}
            </div>
            <div className="card-body">
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        
                        <h6 className="text-muted mt-3 mb-2">Personal Details</h6>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control form-control-sm" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Middle Name</label>
                                <input type="text" className="form-control form-control-sm" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control form-control-sm" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Designation / Target Role</label>
                            <input type="text" className="form-control form-control-sm" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Software Engineer" />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control form-control-sm" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone Number</label>
                                <input type="text" className="form-control form-control-sm" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Professional Summary</label>
                            <textarea className="form-control form-control-sm" name="summary" rows="3" value={formData.summary} onChange={handleChange}></textarea>
                        </div>

                        <hr />
                        <h6 className="text-muted mt-3 mb-2">Links & Files</h6>
                        
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">LinkedIn URL</label>
                                <input type="url" className="form-control form-control-sm" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">GitHub URL</label>
                                <input type="url" className="form-control form-control-sm" name="github_url" value={formData.github_url} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Portfolio URL</label>
                                <input type="url" className="form-control form-control-sm" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Master Resume (PDF)</label>
                            {profile?.master_resume && (
                                <div className="mb-2">
                                    <a href={profile.master_resume} target="_blank" rel="noreferrer" className="badge bg-secondary text-decoration-none">View Current Resume</a>
                                </div>
                            )}
                            <input type="file" className="form-control form-control-sm" name="master_resume" onChange={handleChange} accept=".pdf,.doc,.docx" />
                        </div>

                        <hr />
                        <h6 className="text-muted mt-3 mb-2">Location & Work Auth</h6>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Current Location</label>
                                <input type="text" className="form-control form-control-sm" name="current_location" value={formData.current_location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Last Job Location</label>
                                <input type="text" className="form-control form-control-sm" name="last_job_location" value={formData.last_job_location} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Work Authorization / Visa</label>
                                <input type="text" className="form-control form-control-sm" name="work_authorization" value={formData.work_authorization} onChange={handleChange} placeholder="e.g. US Citizen, H1B" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Preferred Locations (Comma-separated)</label>
                            <input type="text" className="form-control form-control-sm" name="preferred_locations" value={formData.preferred_locations} onChange={handleChange} placeholder="e.g. Remote, New York" />
                        </div>
                        
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="willingness_to_relocate" id="willingness_to_relocate" checked={formData.willingness_to_relocate} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="willingness_to_relocate">Willing to relocate</label>
                        </div>

                        <hr />
                        <h6 className="text-muted mt-3 mb-2">Experience & Salary</h6>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Years of Exp</label>
                                <input type="number" className="form-control form-control-sm" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Notice Period (Days)</label>
                                <input type="number" className="form-control form-control-sm" name="notice_period_days" value={formData.notice_period_days} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Currency</label>
                                <input type="text" className="form-control form-control-sm" name="currency" value={formData.currency} onChange={handleChange} placeholder="USD" />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Current Salary (Fixed)</label>
                                <input type="number" className="form-control form-control-sm" name="current_salary_fixed" value={formData.current_salary_fixed} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Current Salary (Variable)</label>
                                <input type="number" className="form-control form-control-sm" name="current_salary_variable" value={formData.current_salary_variable} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Expected Salary (Total)</label>
                                <input type="number" className="form-control form-control-sm" name="expected_salary" value={formData.expected_salary} onChange={handleChange} />
                            </div>
                        </div>

                        <hr />
                        <h6 className="text-muted mt-3 mb-2">Core Skills</h6>
                        
                        <TechStackSelect 
                            selectedStacks={formData.core_skills} 
                            onChange={handleTechStackChange} 
                            label="Primary Technologies & Skills" 
                        />

                        <div className="text-end mt-4">
                            <button type="button" className="btn btn-secondary btn-sm px-4 me-2" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm px-4">Save Profile</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="mb-4">
                            <h4 className="mb-1">{profile?.first_name} {profile?.middle_name} {profile?.last_name}</h4>
                            <p className="text-muted mb-2">{profile?.designation}</p>
                            
                            <div className="d-flex flex-wrap gap-3 text-secondary small">
                                {profile?.email && <div><i className="bi bi-envelope me-1"></i>{profile.email}</div>}
                                {profile?.phone_number && <div><i className="bi bi-telephone me-1"></i>{profile.phone_number}</div>}
                                {profile?.current_location && <div><i className="bi bi-geo-alt me-1"></i>{profile.current_location}</div>}
                            </div>
                        </div>

                        {profile?.summary && (
                            <div className="mb-4">
                                <h6 className="text-muted mb-2 border-bottom pb-2">Professional Summary</h6>
                                <p className="small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{profile.summary}</p>
                            </div>
                        )}

                        <div className="row mb-4">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <h6 className="text-muted mb-2 border-bottom pb-2">Experience & Salary</h6>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Experience:</span> {profile?.years_of_experience || 0} years</li>
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Notice Period:</span> {profile?.notice_period_days || 0} days</li>
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Current Salary:</span> {profile?.currency} {profile?.current_salary_fixed} {profile?.current_salary_variable ? `(+${profile?.current_salary_variable} var)` : ''}</li>
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Expected Salary:</span> {profile?.currency} {profile?.expected_salary}</li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6 className="text-muted mb-2 border-bottom pb-2">Location & Auth</h6>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Relocate:</span> {profile?.willingness_to_relocate ? 'Yes' : 'No'}</li>
                                    <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Work Auth:</span> {profile?.work_authorization || 'N/A'}</li>
                                    {profile?.preferred_locations && profile.preferred_locations.length > 0 && (
                                        <li className="mb-1"><span className="text-muted d-inline-block" style={{ width: '110px' }}>Preferred:</span> {profile.preferred_locations.join(', ')}</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {(profile?.linkedin_url || profile?.github_url || profile?.portfolio_url || profile?.master_resume) && (
                            <div className="mb-4">
                                <h6 className="text-muted mb-2 border-bottom pb-2">Links & Resume</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary"><i className="bi bi-linkedin me-1"></i> LinkedIn</a>}
                                    {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark"><i className="bi bi-github me-1"></i> GitHub</a>}
                                    {profile?.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info"><i className="bi bi-globe me-1"></i> Portfolio</a>}
                                    {profile?.master_resume && <a href={profile.master_resume} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary"><i className="bi bi-file-earmark-pdf me-1"></i> Resume</a>}
                                </div>
                            </div>
                        )}

                        {profile?.core_skills && profile.core_skills.length > 0 && (
                            <div>
                                <h6 className="text-muted mb-2 border-bottom pb-2">Core Skills</h6>
                                <div className="d-flex flex-wrap gap-1">
                                    {profile.core_skills.map((skill, idx) => (
                                        <span key={idx} className="badge bg-light text-dark border">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Show edit button at bottom if it's a completely empty profile */}
                        {!profile?.id && (
                             <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Complete Profile</button>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BasicInfoForm;
