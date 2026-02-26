import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

function PatternForm({ pattern, categoryId, onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: '',
        description: '',
        use_cases: ''
    });

    const isEditing = !!pattern;

    useEffect(() => {
        if (pattern) {
            setForm({
                name: pattern.name || '',
                description: pattern.description || '',
                use_cases: pattern.use_cases || ''
            });
        }
    }, [pattern]);

    const handleSave = () => {
        if (!form.name.trim()) {
            toast.warning('Pattern name is required');
            return;
        }
        const payload = { ...form, category: categoryId };
        if (isEditing) {
            dispatch({ type: 'UPDATE_DSA_PATTERN', payload, key: pattern.id });
        } else {
            dispatch({ type: 'ADD_DSA_PATTERN', payload });
        }
    };

    return (
        <div className="card border-primary mb-3">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                    <i className={`bi bi-${isEditing ? 'pencil' : 'plus-circle'} me-2`}></i>
                    {isEditing ? 'Edit Pattern' : 'New Pattern'}
                </h6>
                <button className="btn btn-sm btn-outline-light" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Two Pointers, Sliding Window"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                        className="form-control"
                        rows={2}
                        placeholder="What is this pattern about?"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">When to Use</label>
                    <textarea
                        className="form-control"
                        rows={2}
                        placeholder="When should this pattern be applied?"
                        value={form.use_cases}
                        onChange={e => setForm({ ...form, use_cases: e.target.value })}
                    />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className={`bi bi-${isEditing ? 'check-lg' : 'plus-lg'} me-1`}></i>
                        {isEditing ? 'Update' : 'Add'} Pattern
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatternForm;
