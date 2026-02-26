import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnswerCard from './answer_card';
import AnswerForm from './answer_form';

function AnswerBank() {
    const dispatch = useDispatch();
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const answersList = useSelector(state => state.answersList?.data?.body);
    const loading = useSelector(state => state.answersList?.changingStatus === 'ongoing');

    useEffect(() => {
        dispatch({ type: 'GET_ANSWERS', params: {} });
    }, [dispatch]);

    const categories = ['All', 'Career Gap', 'Behavioral', 'Technical', 'Salary Negotiation', 'Custom'];

    const handleAddAnswer = (answerData) => {
        dispatch({ type: 'ADD_ANSWER', payload: answerData, params: {} });
        setShowAddForm(false);
    };

    const filterAnswers = () => {
        if (!answersList?.answers) return [];

        let filtered = answersList.answers;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(answer => answer.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(answer =>
                answer.question.toLowerCase().includes(query) ||
                answer.answer.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const filteredAnswers = filterAnswers();

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-chat-quote me-2"></i>
                    Answer Bank
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Answer
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="mb-4">
                    <AnswerForm
                        onSubmit={handleAddAnswer}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search questions or answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : filteredAnswers.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5 text-muted">
                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">
                            {searchQuery || selectedCategory !== 'All'
                                ? 'No answers found matching your filters'
                                : 'No answers added yet. Click "Add Answer" to get started!'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {filteredAnswers.map((answer) => (
                        <div className="col-12 mb-3" key={answer.id}>
                            <AnswerCard answer={answer} />
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            {answersList?.answers && answersList.answers.length > 0 && (
                <div className="row mt-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body text-center">
                                <h3 className="mb-0">{answersList.answers.length}</h3>
                                <small>Total Answers</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body text-center">
                                <h3 className="mb-0">
                                    {answersList.answers.filter(a => a.confidence >= 4).length}
                                </h3>
                                <small>High Confidence</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body text-center">
                                <h3 className="mb-0">
                                    {answersList.answers.filter(a => a.category === 'Career Gap').length}
                                </h3>
                                <small>Career Gap Answers</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body text-center">
                                <h3 className="mb-0">
                                    {answersList.answers.reduce((sum, a) => sum + (a.practice_count || 0), 0)}
                                </h3>
                                <small>Total Practices</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnswerBank;
