import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProblemForm from "./ProblemForm";
import { updateOrInsert, useUpdateEffect } from "../../utils/helpers";

function ProblemListContainer({ selectedPattern, categories, setCategories }) {
    const dispatch = useDispatch();
    const [patternId, setPatternId] = useState(selectedPattern?.id)
    const [problems, setProblems] = useState(selectedPattern.problems || [])
    const [showProblemForm, setShowProblemForm] = useState(false);
    const [editProblem, setEditProblem] = useState(null);
    const [problemPhrase, setProblemPhrase] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [expandedPhraseId, setExpandedPhraseId] = useState(null);

    const dsaProblem = useSelector(state => state.dsaProblem);

    useEffect(() => {
        setProblems(selectedPattern.problems)
        setPatternId(selectedPattern?.id)
    }, [selectedPattern])

    useUpdateEffect(() => {
        if (dsaProblem?.changingStatus === 'success') {
            const categoryList = structuredClone(categories)
            const selectedCategory = categoryList.find(
                item => item.id === selectedPattern.category
            )
            const selectedCategoryPattern = selectedCategory.patterns.find(
                item => item.id === selectedPattern.id
            )
            if (dsaProblem.data?.body) {
                updateOrInsert(selectedCategoryPattern.problems, dsaProblem.data?.body)
            } else if (dsaProblem.data?.key) {
                selectedCategoryPattern.problems = selectedCategoryPattern.problems.filter(
                    item => item.id !== dsaProblem.data?.key
                )
            }
            setCategories(categoryList)
        }
    }, [dsaProblem])

    const handleSaveProblem = () => {
        if (!problemPhrase.trim()) { toast.warning('Phrase is required'); return; }
        const payload = {
            phrase: problemPhrase,
            statement: problemStatement,
            pattern: patternId
        };
        if (editProblem) {
            dispatch({ type: 'UPDATE_DSA_PROBLEM', payload, key: editProblem.id });
        } else {
            dispatch({ type: 'ADD_DSA_PROBLEM', payload });
        }
        setShowProblemForm(false)
    };

    const handleDeleteProblem = (id) => {
        if (window.confirm('Delete this problem?')) {
            dispatch({ type: 'DELETE_DSA_PROBLEM', key: id });
        }
    };


    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-primary mb-0">Problem Key Phrases</h6>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                        setShowProblemForm(true);
                        setEditProblem(null);
                        setProblemPhrase('');
                        setProblemStatement('');
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add
                </button>
            </div>

            {/* Inline Problem Form */}
            {showProblemForm && (
                <ProblemForm
                    {...{
                        problemPhrase,
                        setProblemPhrase,
                        problemStatement,
                        setProblemStatement,
                        setShowProblemForm,
                        handleSaveProblem,
                        editProblem
                    }}
                />
            )}

            <div className="d-flex flex-column gap-2">
                {(problems || []).map((item) => (
                    <div key={item.id}>
                        <div
                            className={`d-flex align-items-center gap-2 p-2 rounded ${expandedPhraseId === item.id
                                ? 'bg-info bg-opacity-25 border border-info'
                                : 'bg-light border'
                                }`}
                            style={{ cursor: 'pointer' }}
                        >
                            <div
                                className="d-flex align-items-center gap-2 flex-grow-1"
                                onClick={() => setExpandedPhraseId(
                                    expandedPhraseId === item.id ? null : item.id
                                )}
                            >
                                <i className={`bi bi-chevron-${expandedPhraseId === item.id ? 'down' : 'right'} text-primary`}></i>
                                <span className="fw-semibold text-dark">{item.phrase}</span>
                            </div>
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-sm btn-outline-primary py-0 px-1"
                                    title="Edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditProblem(item);
                                        setProblemPhrase(item.phrase);
                                        setProblemStatement(item.statement);
                                        setShowProblemForm(true);
                                    }}
                                >
                                    <i className="bi bi-pencil" style={{ fontSize: '0.7rem' }}></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger py-0 px-1"
                                    title="Delete"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProblem(item.id); }}
                                >
                                    <i className="bi bi-trash" style={{ fontSize: '0.7rem' }}></i>
                                </button>
                            </div>
                        </div>
                        {expandedPhraseId === item.id && (
                            <div className="ps-4 py-2 ms-2 border-start border-info border-2">
                                <p className="mb-0 text-muted">{item.statement}</p>
                            </div>
                        )}
                    </div>
                ))}
                {(!problems || problems.length === 0) && !showProblemForm && (
                    <p className="text-muted mb-0">No problems added yet</p>
                )}
            </div>
        </div>
    );
}

export default ProblemListContainer;