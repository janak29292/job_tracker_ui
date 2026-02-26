import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateEffect } from '../../utils/helpers';
import UnstructuredNode from '../../components/unstructured/UnstructuredNode';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function UnstructuredTab() {
    const dispatch = useDispatch();
    const [notes, setNotes] = useState([]);

    // Top-level add state
    const [isAddingRoot, setIsAddingRoot] = useState(false);
    const [newRootInfo, setNewRootInfo] = useState('');

    const unstructuredList = useSelector(state => state.unstructuredList);
    const unstructuredAction = useSelector(state => state.unstructuredAction);

    useEffect(() => {
        dispatch({ type: 'GET_UNSTRUCTURED_NOTES', params: {} });
    }, [dispatch]);

    // Initial load
    useEffect(() => {
        if (unstructuredList?.data?.body) {
            setNotes(unstructuredList.data.body);
        }
    }, [unstructuredList]);

    // Handle mutations by simply refetching to ensure the nested tree is fully in sync
    // The backend provides the fully nested representation down so this is safe and easy.
    useUpdateEffect(() => {
        if (unstructuredAction?.changingStatus === 'success') {
            dispatch({ type: 'GET_UNSTRUCTURED_NOTES', params: {} });
        }
    }, [unstructuredAction, dispatch]);

    const handleAddRoot = () => {
        if (newRootInfo.trim()) {
            dispatch({
                type: 'ADD_UNSTRUCTURED_NOTE',
                payload: { info: newRootInfo.trim(), parent: null }
            });
            setNewRootInfo('');
            setIsAddingRoot(false);
        }
    };

    const handleAddChild = (parentId, info) => {
        dispatch({
            type: 'ADD_UNSTRUCTURED_NOTE',
            payload: { info, parent: parentId }
        });
    };

    const handleUpdate = (id, info) => {
        dispatch({
            type: 'UPDATE_UNSTRUCTURED_NOTE',
            key: id,
            payload: { info }
        });
    };

    const handleDelete = (id) => {
        dispatch({
            type: 'DELETE_UNSTRUCTURED_NOTE',
            key: id
        });
    };

    return (
        <div className="card mt-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <i className="bi bi-journal-text me-2"></i>
                    Unstructured Notes
                </h5>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsAddingRoot(!isAddingRoot)}
                >
                    <i className="bi bi-plus-lg me-1"></i> Add Root Note
                </button>
            </div>

            <div className="card-body">
                {isAddingRoot && (
                    <div className="p-4 bg-light border rounded mb-4 shadow-sm">
                        <h6 className="mb-3 text-uppercase fw-bold text-muted">Create New Root Note</h6>
                        <div className="bg-white mb-3">
                            <ReactQuill
                                theme="snow"
                                value={newRootInfo}
                                onChange={setNewRootInfo}
                                placeholder="Enter a top-level note..."
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-outline-secondary" onClick={() => setIsAddingRoot(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleAddRoot}>
                                Save Note
                            </button>
                        </div>
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-journal-x" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">No notes yet. Add a root note to get started.</p>
                    </div>
                ) : (
                    <div className="unstructured-tree-root">
                        {notes.map(note => (
                            <UnstructuredNode
                                key={note.id}
                                node={note}
                                onAddChild={handleAddChild}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UnstructuredTab;
