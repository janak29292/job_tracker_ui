import { useState } from 'react';

function AnswerForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        category: 'Career Gap',
        question: '',
        answer: '',
        confidence: 3,
        notes: '',
        tags: []
    });

    const categories = ['Career Gap', 'Behavioral', 'Technical', 'Salary Negotiation', 'Custom'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            alert('Please fill in both question and answer');
            return;
        }
        onSubmit(formData);
        setFormData({ category: 'Career Gap', question: '', answer: '', confidence: 3, notes: '', tags: [] });
    };

    return (
        <div className="card border-primary">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Add New Answer</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label className="form-label">Question *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Why did you leave your previous job?"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Category *</label>
                            <select
                                className="form-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Answer *</label>
                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Write your prepared answer here..."
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                required
                            />
                            <small className="text-muted">Tip: Write it like you'd speak it in an interview</small>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Confidence Level</label>
                            <select
                                className="form-select"
                                value={formData.confidence}
                                onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                            >
                                <option value="1">1 - Very Low (fumble, anxiety)</option>
                                <option value="2">2 - Low (hesitant)</option>
                                <option value="3">3 - Medium (okay)</option>
                                <option value="4">4 - Good (comfortable)</option>
                                <option value="5">5 - Excellent (very confident)</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Notes (Optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Remember to mention specific projects"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Answer
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

export default AnswerForm;
