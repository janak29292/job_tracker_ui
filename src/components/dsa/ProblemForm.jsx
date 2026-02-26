import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function ProblemForm({problemPhrase, setProblemPhrase, problemStatement, setProblemStatement, setShowProblemForm, handleSaveProblem, editProblem}) {
    return (
        <div className="card border-info mb-3">
            <div className="card-body py-2">
                <div className="mb-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Phrase — e.g. 'find pair with target sum'"
                        value={problemPhrase}
                        onChange={e => setProblemPhrase(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="mb-2">
                    <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        placeholder="Statement — full problem description"
                        value={problemStatement}
                        onChange={e => setProblemStatement(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowProblemForm(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={handleSaveProblem}>
                        <i className={`bi bi-${editProblem ? 'check-lg' : 'plus-lg'} me-1`}></i>
                        {editProblem ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProblemForm;