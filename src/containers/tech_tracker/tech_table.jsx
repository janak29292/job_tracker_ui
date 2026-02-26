import { useState } from 'react';
import { useDispatch } from 'react-redux';

function TechTable({ technologies, loading }) {
    const dispatch = useDispatch();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    const handleEdit = (tech) => {
        setEditingId(tech.id);
        setEditData(tech);
    };

    const handleSave = (id) => {
        dispatch({
            type: 'UPDATE_TECH',
            payload: editData,
            key: id,
            params: {}
        });
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this technology?')) {
            dispatch({ type: 'DELETE_TECH', key: id, params: {} });
        }
    };

    const renderStars = (proficiency) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`bi bi-star${i < proficiency ? '-fill' : ''} text-warning`}
            ></i>
        ));
    };

    const getDaysSinceRevision = (lastRevised) => {
        if (!lastRevised) return null;
        const days = Math.floor((new Date() - new Date(lastRevised)) / (1000 * 60 * 60 * 24));
        return days;
    };

    const getRevisionColor = (days) => {
        if (days === null) return 'secondary';
        if (days <= 7) return 'success';
        if (days <= 14) return 'warning';
        return 'danger';
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Proficiency</th>
                                <th>Last Revised</th>
                                <th>Notes</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technologies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-2">No technologies added yet. Click "Add Technology" to get started!</p>
                                    </td>
                                </tr>
                            ) : (
                                technologies.map((tech) => {
                                    const isEditing = editingId === tech.id;
                                    const daysSince = getDaysSinceRevision(tech.last_revised);

                                    return (
                                        <tr key={tech.id}>
                                            <td className="fw-semibold">{tech.name}</td>
                                            <td>
                                                <span className={`badge ${tech.type === 'Technology' ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {tech.type}
                                                </span>
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editData.proficiency}
                                                        onChange={(e) => setEditData({ ...editData, proficiency: parseInt(e.target.value) })}
                                                    >
                                                        {[1, 2, 3, 4, 5].map(level => (
                                                            <option key={level} value={level}>{level} Star{level > 1 ? 's' : ''}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span>{renderStars(tech.proficiency)}</span>
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        value={editData.last_revised || ''}
                                                        onChange={(e) => setEditData({ ...editData, last_revised: e.target.value })}
                                                    />
                                                ) : (
                                                    <>
                                                        {tech.last_revised ? (
                                                            <>
                                                                {new Date(tech.last_revised).toLocaleDateString('en-IN')}
                                                                <br />
                                                                <small className={`text-${getRevisionColor(daysSince)}`}>
                                                                    ({daysSince} days ago)
                                                                </small>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">Never</span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        rows="1"
                                                        value={editData.notes || ''}
                                                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                                    />
                                                ) : (
                                                    <small className="text-muted">{tech.notes || '-'}</small>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {isEditing ? (
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleSave(tech.id)}
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleEdit(tech)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(tech.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TechTable;
