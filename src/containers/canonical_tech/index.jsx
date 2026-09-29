import Spinner from "../../components/common/spinner";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateEffect } from '../../utils/helpers';

function CanonicalTechManager() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    const [contextModalOpen, setContextModalOpen] = useState(false);
    const [contextTech, setContextTech] = useState(null);
    const [contexts, setContexts] = useState([]);
    const [loadingContexts, setLoadingContexts] = useState(false);

    const techStackList = useSelector(state => state.techStackList);
    const deleteStatus = useSelector(state => state.deleteTechStackItem?.changingStatus);
    const deleteData = useSelector(state => state.deleteTechStackItem?.data);
    const techContext = useSelector(state => state.techContext);

    useEffect(() => {
        dispatch({ type: 'GET_TECHSTACK_LIST', params: {} });
    }, [dispatch]);

    useEffect(() => {
        if (deleteStatus === 'success') {
            toast.success('Technology deleted successfully');
            dispatch({ type: 'GET_TECHSTACK_LIST', params: {} });
            // Clear delete status
            dispatch({ type: 'DELETE_TECHSTACK_ITEM_CLEAR' });
        } else if (deleteStatus === 'failed' || deleteStatus === 'netFailed') {
            toast.error(deleteData?.message || 'Failed to delete technology');
            dispatch({ type: 'DELETE_TECHSTACK_ITEM_CLEAR' });
        }
    }, [deleteStatus, deleteData, dispatch]);

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}" from the canonical database?`)) {
            dispatch({ type: 'DELETE_TECHSTACK_ITEM', key: id, params: {} });
        }
    };

    const handleContext = (tech) => {
        setContextTech(tech);
        setContextModalOpen(true);
        setLoadingContexts(true);
        setContexts([]);
        dispatch({ type: 'GET_TECH_CONTEXT', params: { id: tech.id } });
    };

    useUpdateEffect(() => {
        if (techContext?.changingStatus === 'success') {
            if (techContext.data?.body) {
                setContexts(techContext.data.body);
            }
            setLoadingContexts(false);
        } else if (techContext?.changingStatus === 'failed' || techContext?.changingStatus === 'netFailed') {
            toast.error("Failed to load context");
            setLoadingContexts(false);
        }
    }, [techContext]);

    const stacks = techStackList?.data?.body || [];

    // Filter by search term
    const filteredStacks = stacks.filter(tech =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredStacks.length / itemsPerPage);
    const currentData = filteredStacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-book me-2"></i>
                    Canonical Tech Dictionary
                </h2>
                <span className="badge bg-secondary fs-6">
                    Total: {stacks.length}
                </span>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search technologies (e.g. data, react)..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // reset page on search
                                }}
                            />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Technology Name</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {techStackList?.changingStatus === 'ongoing' ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5">
                                            <Spinner />
                                        </td>
                                    </tr>
                                ) : currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-2"></i>
                                            <p className="mt-2">No technologies found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((tech) => (
                                        <tr key={tech.id}>
                                            <td className="text-muted">#{tech.id}</td>
                                            <td className="fw-semibold">{tech.name}</td>
                                            <td className="text-end">
                                                {tech.has_context && (
                                                    <button
                                                        className="btn btn-sm btn-outline-info me-2"
                                                        onClick={() => handleContext(tech)}
                                                    >
                                                        <i className="bi bi-info-circle"></i> Context
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(tech.id, tech.name)}
                                                >
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="text-muted small">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStacks.length)} of {filteredStacks.length} entries
                            </div>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                </li>
                                <li className="page-item active">
                                    <span className="page-link">{currentPage} / {totalPages}</span>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {/* Context Modal */}
            {contextModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Context for "{contextTech?.name}"
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setContextModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                {loadingContexts ? (
                                    <div className="text-center py-4">
                                        <Spinner />
                                    </div>
                                ) : contexts.length === 0 ? (
                                    <p className="text-muted text-center py-4">No job contexts found for this technology.</p>
                                ) : (
                                    <div className="list-group">
                                        {contexts.map((ctx, idx) => (
                                            <div key={idx} className="list-group-item">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="badge bg-primary">Raw Spell: {ctx.raw_tech}</span>
                                                    <span className="text-muted small">Job ID: {ctx.job_id}</span>
                                                </div>
                                                <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {ctx.job_description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CanonicalTechManager;
