import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function EditCategoryInput({category, setEditCategoryId}) {
    const dispatch = useDispatch();
    const [editCategoryName, setEditCategoryName] = useState(category.name);

    const handleUpdateCategory = (id) => {
        if (!editCategoryName.trim()) { toast.warning('Category name is required'); return; }
        dispatch({ type: 'UPDATE_CATEGORY', payload: { name: editCategoryName }, key: id });
    };

    return (
        <div className="p-2 d-flex gap-1">
            <input
                type="text"
                className="form-control form-control-sm"
                value={editCategoryName}
                onChange={e => setEditCategoryName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUpdateCategory(category.id)}
                autoFocus
            />
            <button className="btn btn-sm btn-success" onClick={() => {handleUpdateCategory(category.id); setEditCategoryId(null);}}>
                <i className="bi bi-check-lg"></i>
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditCategoryId(null)}>
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
    );
}

export default EditCategoryInput;