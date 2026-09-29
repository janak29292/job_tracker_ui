import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AutomatedQAManager() {
    const dispatch = useDispatch();
    const questionsState = useSelector(state => state.qaQuestion);
    let questions = [];
    if (Array.isArray(questionsState?.data)) {
        questions = questionsState.data;
    } else if (Array.isArray(questionsState?.data?.results)) {
        questions = questionsState.data.results;
    } else if (Array.isArray(questionsState?.data?.body)) {
        questions = questionsState.data.body;
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

    const [newQuestion, setNewQuestion] = useState('');
    const [newCategory, setNewCategory] = useState('GENERAL');
    
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        pattern: '',
        category: ''
    });

    useEffect(() => {
        dispatch({ type: 'GET_QUESTION' });
    }, [dispatch]);

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        dispatch({ type: 'ADD_QUESTION', payload: { pattern: newQuestion, category: newCategory } });
        setNewQuestion('');
        setTimeout(() => dispatch({ type: 'GET_QUESTION' }), 300);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this question from the bank?")) {
            dispatch({ type: 'DELETE_QUESTION', key: id });
            setTimeout(() => dispatch({ type: 'GET_QUESTION' }), 300);
        }
    };

    const handleEditClick = (q) => {
        setEditingQuestionId(q.id);
        setEditFormData({
            pattern: q.pattern,
            category: q.category
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        
        // Save Question updates
        dispatch({ 
            type: 'UPDATE_QUESTION', 
            key: editingQuestionId, 
            payload: { pattern: editFormData.pattern, category: editFormData.category } 
        });

        setEditingQuestionId(null);
        setTimeout(() => dispatch({ type: 'GET_QUESTION' }), 300);
    };



    return (
        <div className="card shadow-sm mt-3">
            <div className="card-header bg-white">
                <h5 className="mb-0">Automated Q&A Rules</h5>
                <small className="text-muted">Configure how the AI applier responds to application form questions.</small>
            </div>
            
            <div className="card-body bg-light">
                <form onSubmit={handleAddQuestion} className="d-flex mb-4">
                    <select className="form-select form-select-sm me-2 w-auto" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                        <option value="GENERAL">General</option>
                        <option value="DEMOGRAPHIC">Demographic</option>
                        <option value="SENSITIVE">Sensitive</option>
                    </select>
                    <input 
                        type="text" 
                        className="form-control form-control-sm me-2" 
                        placeholder="e.g. 'What is your gender?'" 
                        value={newQuestion} 
                        onChange={(e) => setNewQuestion(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="btn btn-sm btn-primary text-nowrap">
                        <i className="bi bi-plus-lg"></i> Add Question
                    </button>
                </form>

                <ul className="list-group list-group-flush">
                    {questions.length === 0 ? (
                        <li className="list-group-item text-center text-muted py-4">No questions configured.</li>
                    ) : (
                        questions.map((q, idx) => (
                            <li className="list-group-item py-3" key={q.id}>
                                {editingQuestionId === q.id ? (
                                    <form onSubmit={handleSaveEdit}>
                                        <div className="row mb-2">
                                            <div className="col-md-3">
                                                <label className="form-label small text-muted mb-1">Category</label>
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    value={editFormData.category} 
                                                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                                                >
                                                    <option value="GENERAL">General</option>
                                                    <option value="DEMOGRAPHIC">Demographic</option>
                                                    <option value="SENSITIVE">Sensitive</option>
                                                </select>
                                            </div>
                                            <div className="col-md-9">
                                                <label className="form-label small text-muted mb-1">Question Pattern</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-sm" 
                                                    value={editFormData.pattern}
                                                    onChange={(e) => setEditFormData({...editFormData, pattern: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mt-3">
                                            <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setEditingQuestionId(null)}>Cancel</button>
                                            <button type="submit" className="btn btn-sm btn-success">Save Changes</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className={`badge me-3 ${q.category === 'DEMOGRAPHIC' ? 'bg-info text-dark' : q.category === 'SENSITIVE' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {q.category}
                                            </span>
                                            <span className="fw-medium">{q.pattern}</span>
                                        </div>
                                        <div className="text-nowrap ms-3">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(q)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(q.id)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default AutomatedQAManager;
