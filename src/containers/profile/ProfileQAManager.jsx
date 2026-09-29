import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ProfileQAManager() {
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

    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        answerText: '',
        answerId: null
    });

    useEffect(() => {
        dispatch({ type: 'GET_QUESTION' });
    }, [dispatch]);

    const handleEditClick = (q) => {
        setEditingQuestionId(q.id);
        setEditFormData({
            answerText: q.answers && q.answers.length > 0 ? q.answers[0].text : '',
            answerId: q.answers && q.answers.length > 0 ? q.answers[0].id : null
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        
        if (editFormData.answerText.trim()) {
            if (editFormData.answerId) {
                dispatch({ 
                    type: 'UPDATE_QA_ANSWER', 
                    key: editFormData.answerId, 
                    payload: { text: editFormData.answerText } 
                });
            } else {
                dispatch({ 
                    type: 'ADD_QA_ANSWER', 
                    payload: { question: editingQuestionId, text: editFormData.answerText, profile: profile?.id } 
                });
            }
        }

        setEditingQuestionId(null);
        setTimeout(() => dispatch({ type: 'GET_QUESTION' }), 300);
    };

    const handleAddAnswer = (questionId, text) => {
        if (!text.trim()) return;
        dispatch({ type: 'ADD_QA_ANSWER', payload: { question: questionId, text, profile: profile?.id } });
        setTimeout(() => dispatch({ type: 'GET_QUESTION' }), 300);
    };

    return (
        <div className="card shadow-sm mb-4 border-0" style={{ borderLeft: '4px solid #6f42c1' }}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-purple" style={{ color: '#6f42c1' }}>Application Q&A</h5>
            </div>
            
            <div className="card-body bg-light p-0">
                <ul className="list-group list-group-flush">
                    {questions.length === 0 ? (
                        <li className="list-group-item text-center text-muted py-4 bg-transparent border-0">No questions available to answer. Add questions in the Answer Bank.</li>
                    ) : (
                        questions.map((q, idx) => (
                            <li className="list-group-item bg-transparent" key={q.id}>
                                <div className="py-2">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className={`badge me-2 ${q.category === 'DEMOGRAPHIC' ? 'bg-info text-dark' : q.category === 'SENSITIVE' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {q.category}
                                        </span>
                                        <span className="fw-medium">{q.pattern}</span>
                                        {(!q.answers || q.answers.length === 0) && <span className="ms-auto badge bg-danger">Needs Answer</span>}
                                    </div>
                                    
                                    <div className="mt-3">
                                        {editingQuestionId === q.id ? (
                                            <form onSubmit={handleSaveEdit}>
                                                <div className="mb-3">
                                                    <label className="form-label small text-muted mb-1">Your Answer</label>
                                                    <textarea 
                                                        className="form-control form-control-sm" 
                                                        rows="3"
                                                        value={editFormData.answerText}
                                                        onChange={(e) => setEditFormData({...editFormData, answerText: e.target.value})}
                                                        placeholder="Enter your standard answer to this question..."
                                                    ></textarea>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setEditingQuestionId(null)}>Cancel</button>
                                                    <button type="submit" className="btn btn-sm btn-success">Save Answer</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                {q.answers && q.answers.length > 0 ? (
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1 pe-4">
                                                            <strong className="small text-muted">Current Answer:</strong>
                                                            <p className="p-3 border rounded bg-white mt-1 mb-0 shadow-sm" style={{ whiteSpace: 'pre-wrap' }}>{q.answers[0].text}</p>
                                                        </div>
                                                        <button className="btn btn-sm btn-outline-primary mt-4" onClick={() => handleEditClick(q)}>Edit</button>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const text = e.target.elements.answerText.value;
                                                        handleAddAnswer(q.id, text);
                                                    }} className="mt-2">
                                                        <div className="input-group input-group-sm">
                                                            <input type="text" className="form-control" name="answerText" placeholder="Your standard answer..." required />
                                                            <button className="btn btn-outline-success" type="submit">Save Answer</button>
                                                        </div>
                                                    </form>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ProfileQAManager;
