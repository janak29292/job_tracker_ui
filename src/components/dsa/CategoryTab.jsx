function CategoryTab({category, openCategories, toggleCategory, setEditCategoryId, handleDeleteCategory}) {
    return (
        <div className="d-flex align-items-center">
            <button
                className={`accordion-button flex-grow-1 ${openCategories[category.id] ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleCategory(category.id)}
            >
                <strong>{category.name}</strong>
                <span className="badge bg-secondary ms-2">
                    {category.patterns?.length || 0}
                </span>
            </button>
            <div className="d-flex me-2 gap-1">
                <button
                    className="btn btn-sm btn-outline-primary"
                    title="Edit"
                    onClick={(e) => { e.stopPropagation(); setEditCategoryId(category.id);}}
                >
                    <i className="bi bi-pencil-fill" style={{ fontSize: '0.65rem' }}></i>
                </button>
                <button
                    className="btn btn-sm btn-outline-danger"
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                >
                    <i className="bi bi-trash-fill" style={{ fontSize: '0.65rem' }}></i>
                </button>
            </div>
        </div>
    );
}

export default CategoryTab;