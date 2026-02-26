import { useState } from 'react';

function AddTechForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Technology',
        proficiency: 3,
        notes: '',
        resource_link: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('Please enter a technology name');
            return;
        }
        onSubmit(formData);
        setFormData({ name: '', type: 'Technology', proficiency: 3, notes: '', resource_link: '' });
    };

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Add New Technology/Tool</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Python, Docker, Kubernetes"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Type *</label>
                            <select
                                className="form-select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Technology">Technology</option>
                                <option value="Tool">Tool</option>
                            </select>
                            <small className="text-muted">Tech = Need deep knowledge, Tool = Surface knowledge OK</small>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Proficiency *</label>
                            <select
                                className="form-select"
                                value={formData.proficiency}
                                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                            >
                                <option value="1">1 - Beginner</option>
                                <option value="2">2 - Basic</option>
                                <option value="3">3 - Intermediate</option>
                                <option value="4">4 - Advanced</option>
                                <option value="5">5 - Expert</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Notes</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Strong in async programming"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Resource Link</label>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://link-to-your-notes.com"
                                value={formData.resource_link}
                                onChange={(e) => setFormData({ ...formData, resource_link: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Technology
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTechForm;
