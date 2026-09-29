import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

function BulletPointsManager({ itemId, itemType, bullets = [] }) {
    const dispatch = useDispatch();
    const [bulletInput, setBulletInput] = useState('');
    const [editingBulletId, setEditingBulletId] = useState(null);
    const [editingBulletContent, setEditingBulletContent] = useState("");

    const handleAddBullet = (e) => {
        e.preventDefault();
        if (!bulletInput.trim()) return;
        
        dispatch({ 
            type: `ADD_${itemType}_BULLET`, 
            payload: { 
                content: bulletInput,
                model_name: itemType.toLowerCase() === 'experience' ? 'workexperience' : itemType.toLowerCase(),
                object_id: itemId
            } 
        });
        
        setBulletInput('');
        setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
    };

    const handleDeleteBullet = (bulletId) => {
        if (window.confirm("Delete this bullet point?")) {
            dispatch({ 
                type: `DELETE_${itemType}_BULLET`, 
                key: bulletId
            });
            setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
        }
    };

    const handleEditBulletClick = (bullet) => {
        setEditingBulletId(bullet.id);
        setEditingBulletContent(bullet.content);
    };

    const handleSaveBulletEdit = (bulletId) => {
        if (!editingBulletContent.trim()) return;
        dispatch({ 
            type: `EDIT_${itemType}_BULLET`, 
            payload: { content: editingBulletContent }, 
            key: bulletId 
        });
        setEditingBulletId(null);
        setEditingBulletContent("");
        setTimeout(() => dispatch({ type: 'GET_PROFILE' }), 300);
    };

    return (
        <div className="mt-3 ms-3">
            <ul className="mb-3 text-secondary" style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                {bullets.map(bullet => (
                    <li key={bullet.id} className="mb-2">
                        {editingBulletId === bullet.id ? (
                            <div className="d-flex mt-1">
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm me-2" 
                                    value={editingBulletContent}
                                    onChange={(e) => setEditingBulletContent(e.target.value)}
                                />
                                <button className="btn btn-sm btn-success me-1" onClick={() => handleSaveBulletEdit(bullet.id)}>Save</button>
                                <button className="btn btn-sm btn-secondary" onClick={() => setEditingBulletId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-start">
                                <span style={{ lineHeight: '1.4' }}>{bullet.content}</span>
                                <div className="text-nowrap ms-2 mt-1">
                                    <button className="btn btn-link btn-sm text-secondary p-0 ms-2" onClick={() => handleEditBulletClick(bullet)}>
                                        <i className="bi bi-pencil" style={{fontSize: '0.85rem'}}></i>
                                    </button>
                                    <button className="btn btn-link btn-sm text-danger p-0 ms-3" onClick={() => handleDeleteBullet(bullet.id)}>
                                        <i className="bi bi-trash" style={{fontSize: '0.85rem'}}></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddBullet} className="d-flex align-items-center mt-2 ps-3">
                <input 
                    type="text" 
                    className="form-control form-control-sm me-2" 
                    placeholder="Add a bullet point..." 
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-outline-primary text-nowrap">
                    <i className="bi bi-plus-lg"></i> Add
                </button>
            </form>
        </div>
    );
}

export default BulletPointsManager;
