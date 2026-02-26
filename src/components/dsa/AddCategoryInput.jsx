import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddCategoryInput({ setShowCategoryInput}) {
    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState('');

    
    const handleAddCategory = () => {
        if (!categoryName.trim()) { toast.warning('Category name is required'); return; }
        dispatch({ type: 'ADD_CATEGORY', payload: { name: categoryName } });
    };


    return (
        <div className="p-3 border-bottom bg-light">
            <div className="input-group input-group-sm">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Category name..."
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    autoFocus
                />
                <button className="btn btn-success" onClick={handleAddCategory}>
                    <i className="bi bi-check-lg"></i>
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { setShowCategoryInput(false); setCategoryName(''); }}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        </div>
    );
}

export default AddCategoryInput;