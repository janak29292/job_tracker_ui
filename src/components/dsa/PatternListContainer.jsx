function PatternListContainer(
    {
        category,
        selectedPattern,
        setSelectedPattern,
        setShowPatternForm,
        setPatternFormCategoryId,
        setEditPattern
    }
) {
    return (
        <div className="accordion-collapse collapse show">
            <div className="list-group list-group-flush">
                {(category.patterns || []).map((pattern) => (
                    <button
                        key={pattern.id}
                        className={`list-group-item list-group-item-action ps-4 d-flex justify-content-between align-items-center ${selectedPattern?.id === pattern.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedPattern(pattern);
                            setShowPatternForm(false);
                        }}
                    >
                        <span>{pattern.name}</span>
                    </button>
                ))}
                <button
                    className="list-group-item list-group-item-action ps-4 text-primary"
                    onClick={() => {
                        setPatternFormCategoryId(category.id);
                        setEditPattern(null);
                        setShowPatternForm(true);
                    }}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Pattern
                </button>
            </div>
        </div>
    );
}

export default PatternListContainer;
