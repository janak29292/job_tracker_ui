import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function UnstructuredNode({ node, level = 0, onAddChild, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editInfo, setEditInfo] = useState(node.info);

    const [isAddingChild, setIsAddingChild] = useState(false);
    const [newChildInfo, setNewChildInfo] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Default to open
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const htmlBlob = new Blob([node.info], { type: 'text/html' });

            // Create a temporary element to strip HTML tags for the plain-text fallback
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = node.info;
            const plainText = tempDiv.innerText || tempDiv.textContent || '';
            const plainBlob = new Blob([plainText], { type: 'text/plain' });

            const clipboardItem = new window.ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': plainBlob,
            });

            await navigator.clipboard.write([clipboardItem]);

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Could not copy rich text: ", err);
        }
    };

    const handleSaveEdit = () => {
        if (editInfo.trim() && editInfo !== node.info) {
            onUpdate(node.id, editInfo.trim());
        }
        setIsEditing(false);
    };

    const handleSaveChild = () => {
        if (newChildInfo.trim()) {
            onAddChild(node.id, newChildInfo.trim());
            setNewChildInfo('');
            setIsAddingChild(false);
            setIsOpen(true);
        }
    };

    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className={`unstructured-node ${level > 0 ? 'ms-3 border-start border-2' : 'mb-3'}`} style={{ borderColor: '#e9ecef' }}>
            {/* Main Block for this node */}
            <div className={`d-flex flex-column group-hover-show py-1 px-2 ${level === 0 ? 'bg-white border rounded shadow-sm mb-2' : ''}`}>
                {isEditing ? (
                    <div className="w-100 bg-white border rounded shadow-sm my-2 z-index-3">
                        <div className="mb-2" style={{ backgroundColor: 'white' }}>
                            <ReactQuill theme="snow" value={editInfo} onChange={setEditInfo} />
                        </div>
                        <div className="d-flex justify-content-end gap-2 p-2 pt-0">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => { setIsEditing(false); setEditInfo(node.info); }}>
                                Cancel
                            </button>
                            <button className="btn btn-sm btn-primary" onClick={handleSaveEdit}>
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="d-flex align-items-start position-relative hover-bg-light rounded p-1"
                        style={{ minHeight: '32px', cursor: hasChildren ? 'pointer' : 'default' }}
                        onClick={() => { if (hasChildren) setIsOpen(!isOpen) }}
                    >
                        {/* Expand/Collapse Affordance */}
                        <div style={{ width: '24px', flexShrink: 0, marginTop: '2px' }} className="d-flex justify-content-center">
                            {hasChildren ? (
                                <div
                                    className="d-flex justify-content-center align-items-center rounded hover-bg-light"
                                    style={{ width: '20px', height: '24px' }}
                                    title={isOpen ? "Collapse" : "Expand"}
                                >
                                    <i className={`bi bi-chevron-${isOpen ? 'down' : 'right'} text-muted`}></i>
                                </div>
                            ) : (
                                <span className="text-secondary opacity-25" style={{ fontSize: '0.5rem', marginTop: '6px' }}>●</span>
                            )}
                        </div>

                        {/* Rich Text Content */}
                        <div className="flex-grow-1 min-w-0 pb-1" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                            <div className="quill-content" dangerouslySetInnerHTML={{ __html: node.info }} />
                        </div>

                        {/* Hover Actions Menu */}
                        <div
                            className="action-buttons d-flex gap-1 opacity-0 transition-opacity align-items-center ms-2 bg-white rounded shadow-sm px-1 py-1 border"
                            style={{ position: 'absolute', right: '8px', top: '4px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="btn btn-sm text-primary p-0 px-2 rounded hover-bg-light border-0" onClick={() => { setIsAddingChild(!isAddingChild); setIsOpen(true); }} title="Add Child Note">
                                <i className="bi bi-plus-lg"></i>
                            </button>
                            <button className="btn btn-sm text-secondary p-0 px-4 rounded hover-bg-light border-0" onClick={() => setIsEditing(true)} title="Edit Note">
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm text-info p-0 px-4 rounded hover-bg-light border-0" onClick={(e) => { e.stopPropagation(); handleCopy(); }} title="Copy Text">
                                <i className={`bi ${isCopied ? 'bi-check2 text-success' : 'bi-clipboard'}`}></i>
                            </button>
                            <button className="btn btn-sm text-danger p-0 px-1 rounded hover-bg-light border-0" onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Delete this note and all its children?')) onDelete(node.id);
                            }} title="Delete Note">
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Recursively render children */}
            {hasChildren && isOpen && (
                <div className="children-container mt-1">
                    {node.children.map(child => (
                        <UnstructuredNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onAddChild={onAddChild}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}

                    {/* Add Inline Child Affordance (only for nodes with children) */}
                    <div className="unstructured-node ms-3 border-start border-2" style={{ borderColor: '#e9ecef' }}>
                        {!isAddingChild ? (
                            <div className="d-flex flex-column py-1 px-2">
                                <div
                                    className="d-flex align-items-start position-relative hover-bg-light rounded p-1"
                                    style={{ minHeight: '32px', cursor: 'pointer' }}
                                    onClick={() => setIsAddingChild(true)}
                                >
                                    <div style={{ width: '24px', flexShrink: 0, marginTop: '2px' }} className="d-flex justify-content-center">
                                        <i className="bi bi-plus-lg text-muted my-1 opacity-75"></i>
                                    </div>
                                    <div className="flex-grow-1 min-w-0 pb-1 text-muted opacity-75" style={{ paddingTop: '3px', fontSize: '0.95rem' }}>
                                        Add child note...
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-light border rounded mb-2 mt-1 mx-2 shadow-sm position-relative">
                                <strong className="d-block mb-2 text-muted small text-uppercase fw-bold">Adding Nested Note</strong>
                                <div className="bg-white mb-2 border rounded">
                                    <ReactQuill theme="snow" value={newChildInfo} onChange={setNewChildInfo} placeholder="Type child note here..." />
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsAddingChild(false)}>Cancel</button>
                                    <button className="btn btn-sm btn-primary" onClick={handleSaveChild}>Save Note</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Form for adding a child if node has NO children yet */}
            {!hasChildren && isAddingChild && (
                <div className="ms-3 p-3 bg-light border rounded mb-2 mt-1 shadow-sm position-relative">
                    <strong className="d-block mb-2 text-muted small text-uppercase fw-bold">Adding Nested Note</strong>
                    <div className="bg-white mb-2 border rounded">
                        <ReactQuill theme="snow" value={newChildInfo} onChange={setNewChildInfo} placeholder="Type child note here..." />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsAddingChild(false)}>Cancel</button>
                        <button className="btn btn-sm btn-primary" onClick={handleSaveChild}>Save Note</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Clean global styling for the Threaded view
const style = document.createElement('style');
style.textContent = `
    .group-hover-show:hover .action-buttons { opacity: 1 !important; }
    .transition-opacity { transition: opacity 0.15s ease-in-out; }
    .hover-bg-light:hover { background-color: rgba(0,0,0,.04); }
    .hover-dark:hover { color: #000 !important; opacity: 1 !important; }
    
    /* Clean Quill Content Resets */
    .quill-content { font-size: 0.95rem; line-height: 1.5; color: #333; }
    .quill-content p { margin-bottom: 0.35rem; }
    .quill-content p:last-child { margin-bottom: 0; }
    .quill-content pre { padding: 8px 12px; border-radius: 6px; background: #f8f9fa; border: 1px solid #e9ecef; font-size: 0.85em; margin-top: 8px; margin-bottom: 8px;}
    .quill-content blockquote { border-left: 3px solid #ced4da; padding-left: 12px; color: #6c757d; margin: 6px 0; }
    .quill-content ul, .quill-content ol { padding-left: 1.5rem; margin-bottom: 0.35rem; }
`;
document.head.appendChild(style);

export default UnstructuredNode;
