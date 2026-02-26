import { useState } from 'react';
import { useDispatch } from 'react-redux';

function AnswerCard({ answer }) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(answer);
    const [copied, setCopied] = useState(false);

    const categoryColors = {
        'Career Gap': 'danger',
        'Behavioral': 'primary',
        'Technical': 'success',
        'Salary Negotiation': 'warning',
        'Custom': 'secondary',
    };

    const handlePractice = () => {
        dispatch({ type: 'TRACK_PRACTICE', payload: { id: answer.id }, key: answer.id, params: {} });
    };

    const handleSave = () => {
        dispatch({ type: 'UPDATE_ANSWER', payload: editData, key: answer.id, params: {} });
        setIsEditing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(answer.answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this answer?')) {
            dispatch({ type: 'DELETE_ANSWER', key: answer.id, params: {} });
        }
    };

    const renderStars = (confidence) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`bi bi-star${i < confidence ? '-fill' : ''} text-warning`}
            ></i>
        ));
    };

    return (
        <div className="card">
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        {isEditing ? (
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editData.question}
                                onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                            />
                        ) : (
                            <h5 className="mb-2">{answer.question}</h5>
                        )}
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <span className={`badge bg-${categoryColors[answer.category]}`}>
                                {answer.category}
                            </span>
                            <span className="text-muted">|</span>
                            <span>{renderStars(answer.confidence || 0)}</span>
                            <span className="text-muted">|</span>
                            <small className="text-muted">
                                Practiced {answer.practice_count || 0} times
                            </small>
                            {answer.last_practiced && (
                                <>
                                    <span className="text-muted">|</span>
                                    <small className="text-muted">
                                        Last: {new Date(answer.last_practiced).toLocaleDateString('en-IN')}
                                    </small>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="btn-group">
                        {isEditing ? (
                            <>
                                <button className="btn btn-sm btn-success" onClick={handleSave}>
                                    <i className="bi bi-check-lg"></i>
                                </button>
                                <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={handlePractice}
                                    title="Mark as practiced"
                                >
                                    <i className="bi bi-check2-circle"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={handleCopy}
                                    title="Copy to clipboard"
                                >
                                    <i className={`bi bi-${copied ? 'check' : 'clipboard'}`}></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit"
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={handleDelete}
                                    title="Delete"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-body">
                {isEditing ? (
                    <>
                        <textarea
                            className="form-control mb-3"
                            rows="6"
                            value={editData.answer}
                            onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
                        />
                        <div className="row g-2">
                            <div className="col-md-6">
                                <label className="form-label small">Confidence</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={editData.confidence}
                                    onChange={(e) => setEditData({ ...editData, confidence: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <option key={level} value={level}>{level} Star{level > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Category</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={editData.category}
                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                >
                                    {Object.keys(categoryColors).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{answer.answer}</p>
                        {answer.notes && (
                            <div className="alert alert-info mb-0">
                                <small>
                                    <i className="bi bi-sticky me-2"></i>
                                    <strong>Note:</strong> {answer.notes}
                                </small>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AnswerCard;
