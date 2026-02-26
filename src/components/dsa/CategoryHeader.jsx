function CategoryHeader({categories, showCategoryInput, setShowCategoryInput}) {
    return (
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
                <i className="bi bi-diagram-3 me-2"></i>
                Categories ({categories.length})
            </h5>
            <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setShowCategoryInput(!showCategoryInput)}
                title="Add Category"
            >
                <i className="bi bi-plus-lg"></i>
            </button>
        </div>
    );
}

export default CategoryHeader;