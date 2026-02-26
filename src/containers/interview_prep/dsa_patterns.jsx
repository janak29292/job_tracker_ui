import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PatternForm from './pattern_form';
import CategoryHeader from '../../components/dsa/CategoryHeader';
import AddCategoryInput from '../../components/dsa/AddCategoryInput';
import EditCategoryInput from '../../components/dsa/EditCategoryInput';
import CategoryTab from '../../components/dsa/CategoryTab';
import PatternListContainer from '../../components/dsa/PatternListContainer';
import { updateOrInsert, useUpdateEffect } from '../../utils/helpers';
import ProblemListContainer from '../../components/dsa/ProblemListContainer';
import ApproachListContainer from '../../components/dsa/ApproachListContainer';

function DSAPatterns({ categoryList }) {
    const dispatch = useDispatch();

    // Local copy of data — this is what we render from
    const [categories, setCategories] = useState(categoryList || []);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [openCategories, setOpenCategories] = useState({});

    // Modals / inline forms
    const [showPatternForm, setShowPatternForm] = useState(false);
    const [editPattern, setEditPattern] = useState(null);
    const [patternFormCategoryId, setPatternFormCategoryId] = useState(null);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);

    // One selector per entity (only what parent still needs)
    const dsaCategory = useSelector(state => state.dsaCategory);
    const dsaPattern = useSelector(state => state.dsaPattern);

    // Initialize local data from prop
    useEffect(() => {
        setCategories(categoryList)
    }, [categoryList]);

    // Keep selectedPattern in sync when categories change
    useEffect(() => {
        if (selectedPattern) {
            const selectedCategory = categories.find(
                item => item.id === selectedPattern.category
            )
            if (selectedCategory) {
                setSelectedPattern(
                    selectedCategory.patterns.find(
                        item => item.id === selectedPattern.id
                    ) || null
                )
            }
        }
    }, [categories])

    // ============================================================
    // Category — response handling
    // ============================================================
    useUpdateEffect(() => {
        if (dsaCategory?.changingStatus === 'success') {
            if (dsaCategory.data?.body) {
                const categoryList = [...categories]
                updateOrInsert(categoryList, dsaCategory.data?.body)
                setCategories(categoryList)
                setShowCategoryInput(false)
                setEditCategoryId(null)
            } else if (dsaCategory.data?.key) {
                setCategories(prev => prev.filter(cat => cat.id !== dsaCategory.data.key))
            }
        }
    }, [dsaCategory])

    // ============================================================
    // Pattern — response handling
    // ============================================================
    useUpdateEffect(() => {
        if (dsaPattern?.changingStatus === 'success') {
            const categoryList = structuredClone(categories)
            if (dsaPattern.data?.body) {
                const body = dsaPattern.data.body
                const targetCategory = categoryList.find(
                    item => item.id === body.category
                )
                if (targetCategory) {
                    updateOrInsert(targetCategory.patterns, body)
                }
                setShowPatternForm(false)
                setEditPattern(null)
            } else if (dsaPattern.data?.key) {
                const deleteId = dsaPattern.data.key
                categoryList.forEach(cat => {
                    cat.patterns = (cat.patterns || []).filter(
                        item => item.id !== deleteId
                    )
                })
                if (selectedPattern?.id === deleteId) {
                    setSelectedPattern(null)
                }
            }
            setCategories(categoryList)
        }
    }, [dsaPattern])

    // ============================================================
    // Helpers
    // ============================================================
    const toggleCategory = (categoryId) => {
        setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Delete this category and all its patterns?')) {
            dispatch({ type: 'DELETE_CATEGORY', key: id });
        }
    };

    const handleDeletePattern = (id) => {
        if (window.confirm('Delete this pattern and all its problems/approaches?')) {
            dispatch({ type: 'DELETE_DSA_PATTERN', key: id });
        }
    };

    // ============================================================
    // Render
    // ============================================================
    if (!categories.length && !categories) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {/* Left Panel — Category Accordion */}
            <div className="col-md-4">
                <div className="card position-sticky" style={{ top: '1rem', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
                    <CategoryHeader
                        {...{ categories, showCategoryInput, setShowCategoryInput }}
                    />
                    {/* Add Category Input */}
                    {showCategoryInput && (
                        <AddCategoryInput
                            {...{ setShowCategoryInput }}
                        />
                    )}

                    <div className="accordion accordion-flush">
                        {categories.map((category) => (
                            <div className="accordion-item" key={category.id}>
                                <h2 className="accordion-header">
                                    {editCategoryId === category.id ? (
                                        <EditCategoryInput
                                            {...{ category, setEditCategoryId }}
                                        />
                                    ) : (
                                        <CategoryTab
                                            {...{ category, openCategories, toggleCategory, setEditCategoryId, handleDeleteCategory }}
                                        />
                                    )}
                                </h2>
                                {openCategories[category.id] && (
                                    <PatternListContainer
                                        {...{
                                            category,
                                            selectedPattern,
                                            setSelectedPattern,
                                            setShowPatternForm,
                                            setPatternFormCategoryId,
                                            setEditPattern
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center text-muted py-4">
                                <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                                <p className="mt-2">No categories added yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel — Pattern Detail / Form */}
            <div className="col-md-8">
                {/* Pattern Form (Add/Edit) */}
                {showPatternForm && (
                    <PatternForm
                        pattern={editPattern}
                        categoryId={patternFormCategoryId}
                        onClose={() => { setShowPatternForm(false); setEditPattern(null); }}
                    />
                )}

                {selectedPattern && !showPatternForm ? (
                    <div className="card">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">{selectedPattern.name}</h4>
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    title="Edit Pattern"
                                    onClick={() => {
                                        setEditPattern(selectedPattern);
                                        setPatternFormCategoryId(selectedPattern.category);
                                        setShowPatternForm(true);
                                    }}
                                >
                                    <i className="bi bi-pencil-fill me-1"></i>Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete Pattern"
                                    onClick={() => handleDeletePattern(selectedPattern.id)}
                                >
                                    <i className="bi bi-trash-fill me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Description */}
                            <div className="mb-4">
                                <h6 className="text-primary">Description</h6>
                                <p>{selectedPattern.description}</p>
                            </div>

                            {/* When to Use */}
                            {selectedPattern.use_cases && (
                                <div className="mb-4">
                                    <h6 className="text-primary">When to Use</h6>
                                    <p className="mb-0">
                                        <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                                        {selectedPattern.use_cases}
                                    </p>
                                </div>
                            )}

                            {/* Problem Phrases */}
                            <ProblemListContainer {...{ selectedPattern, categories, setCategories }} />

                            {/* Approaches */}
                            <ApproachListContainer {...{ selectedPattern, categories, setCategories }} />
                        </div>
                    </div>
                ) : !showPatternForm && (
                    <div className="card">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-arrow-left-circle" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3">Select a pattern to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DSAPatterns;
