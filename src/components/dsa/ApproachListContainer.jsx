import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApproachForm from "./ApproachForm";
import { updateOrInsert, useUpdateEffect } from "../../utils/helpers";

function ApproachListContainer({ selectedPattern, categories, setCategories }) {
    const dispatch = useDispatch();
    const [approaches, setApproaches] = useState(selectedPattern.approaches || []);
    const [activeApproachId, setActiveApproachId] = useState(
        selectedPattern.approaches?.[0]?.id || null
    );
    const [showApproachForm, setShowApproachForm] = useState(false);
    const [editApproach, setEditApproach] = useState(null);

    const dsaApproach = useSelector(state => state.dsaApproach);

    useEffect(() => {
        setApproaches(selectedPattern.approaches || []);
        setActiveApproachId(selectedPattern.approaches?.[0]?.id || null);
    }, [selectedPattern]);

    useUpdateEffect(() => {
        if (dsaApproach?.changingStatus === 'success') {
            const categoryList = structuredClone(categories);
            const selectedCategory = categoryList.find(
                item => item.id === selectedPattern.category
            );
            const selectedCategoryPattern = selectedCategory.patterns.find(
                item => item.id === selectedPattern.id
            );
            if (dsaApproach.data?.body) {
                updateOrInsert(selectedCategoryPattern.approaches, dsaApproach.data.body);
                setActiveApproachId(dsaApproach.data.body.id);
                setShowApproachForm(false);
                setEditApproach(null);
            } else if (dsaApproach.data?.key) {
                selectedCategoryPattern.approaches = selectedCategoryPattern.approaches.filter(
                    item => item.id !== dsaApproach.data.key
                );
                if (activeApproachId === dsaApproach.data.key) {
                    setActiveApproachId(selectedCategoryPattern.approaches?.[0]?.id || null);
                }
            }
            setCategories(categoryList);
        }
    }, [dsaApproach]);

    const handleDeleteApproach = (id) => {
        if (window.confirm('Delete this approach?')) {
            dispatch({ type: 'DELETE_APPROACH', key: id });
        }
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-primary mb-0">Approaches</h6>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                        setEditApproach(null);
                        setShowApproachForm(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add
                </button>
            </div>

            {showApproachForm && (
                <ApproachForm
                    approach={editApproach}
                    patternId={selectedPattern?.id}
                    onClose={() => { setShowApproachForm(false); setEditApproach(null); }}
                />
            )}

            {!showApproachForm && approaches.length > 0 ? (
                <>
                    <ul className="nav nav-tabs">
                        {approaches.map((approach) => (
                            <li className="nav-item" key={approach.id}>
                                <button
                                    className={`nav-link ${activeApproachId === approach.id ? 'active' : ''}`}
                                    onClick={() => setActiveApproachId(approach.id)}
                                >
                                    {approach.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {approaches
                        .filter(a => a.id === activeApproachId)
                        .map(approach => (
                            <div key={approach.id} className="border border-top-0 rounded-bottom p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <p className="text-muted mb-0">{approach.description}</p>
                                    <div className="d-flex gap-1 ms-2 flex-shrink-0">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            title="Edit"
                                            onClick={() => {
                                                setEditApproach(approach);
                                                setShowApproachForm(true);
                                            }}
                                        >
                                            <i className="bi bi-pencil-fill" style={{ fontSize: '0.65rem' }}></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => handleDeleteApproach(approach.id)}
                                        >
                                            <i className="bi bi-trash-fill" style={{ fontSize: '0.65rem' }}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mb-3">
                                    <span className="badge bg-success">
                                        <i className="bi bi-clock me-1"></i>
                                        {approach.time_complexity}
                                    </span>
                                    <span className="badge bg-warning text-dark">
                                        <i className="bi bi-memory me-1"></i>
                                        {approach.space_complexity}
                                    </span>
                                </div>

                                {approach.code_example && (
                                    <div>
                                        <h6 className="text-secondary">
                                            <i className="bi bi-code-slash me-1"></i>
                                            Python
                                        </h6>
                                        <pre className="bg-dark text-light p-3 rounded" style={{ fontSize: '0.85rem' }}>
                                            <code>{approach.code_example}</code>
                                        </pre>
                                    </div>
                                )}

                                {approach.code_result && (
                                    <div className="mt-2">
                                        <h6 className="text-secondary">
                                            <i className="bi bi-terminal me-1"></i>
                                            Result
                                        </h6>
                                        <pre className="bg-light p-2 rounded border" style={{ fontSize: '0.85rem' }}>
                                            <code className="text-success">{approach.code_result}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </>
            ) : !showApproachForm && (
                <p className="text-muted">No approaches added yet</p>
            )}
        </div>
    );
}

export default ApproachListContainer;
