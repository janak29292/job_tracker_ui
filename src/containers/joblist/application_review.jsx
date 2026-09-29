import Spinner from "../../components/common/spinner";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateEffect } from '../../utils/helpers';
import { url } from '../../utils/constants';

/**
 * Application Review Modal — shows what the auto-apply agent did
 * and lets the user approve or reject the application.
 * 
 * Displayed when a job is in PR (Pending Review) status.
 */
function ApplicationReviewModal({ jobId, onClose, onAction }) {
    const dispatch = useDispatch();
    
    const applicationRuns = useSelector(state => state.applicationRuns);
    const approveApplication = useSelector(state => state.approveApplication);
    const rejectApplication = useSelector(state => state.rejectApplication);

    const [run, setRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // 'approve' | 'reject' | null

    useEffect(() => {
        setLoading(true);
        dispatch({ type: 'GET_APPLICATION_RUNS', params: { job: jobId, status: 'PENDING_REVIEW' } });
    }, [jobId]);

    useUpdateEffect(() => {
        if (applicationRuns?.changingStatus === 'success') {
            const data = applicationRuns.data?.body;
            if (data?.results?.length > 0) {
                setRun(data.results[0]);
            } else if (data?.length > 0) {
                setRun(data[0]);
            }
            setLoading(false);
        } else if (applicationRuns?.changingStatus === 'failed' || applicationRuns?.changingStatus === 'netFailed') {
            toast.error('Failed to load application review');
            setLoading(false);
        }
    }, [applicationRuns]);

    useUpdateEffect(() => {
        if (approveApplication?.changingStatus === 'success') {
            toast.success('Application approved — submitting now');
            onAction?.('approved');
            onClose();
        } else if (approveApplication?.changingStatus === 'failed' || approveApplication?.changingStatus === 'netFailed') {
            toast.error('Failed to approve');
            setActionLoading(null);
        }
    }, [approveApplication]);

    useUpdateEffect(() => {
        if (rejectApplication?.changingStatus === 'success') {
            toast.info('Application rejected — reverted to Matched');
            onAction?.('rejected');
            onClose();
        } else if (rejectApplication?.changingStatus === 'failed' || rejectApplication?.changingStatus === 'netFailed') {
            toast.error('Failed to reject');
            setActionLoading(null);
        }
    }, [rejectApplication]);

    const handleApprove = () => {
        if (!run) return;
        setActionLoading('approve');
        dispatch({ 
            type: 'APPROVE_APPLICATION', 
            key: run.id,
            payload: {}
        });
    };

    const handleReject = () => {
        if (!run) return;
        setActionLoading('reject');
        dispatch({ 
            type: 'REJECT_APPLICATION', 
            key: run.id,
            payload: {}
        });
    };

    const getSourceBadge = (source) => {
        const map = {
            'cache_hit': { bg: 'bg-success', text: 'Cached' },
            'cache_fail': { bg: 'bg-warning text-dark', text: 'Cache Failed' },
            'llm_decision': { bg: 'bg-primary', text: 'LLM Generated' },
        };
        const info = map[source] || { bg: 'bg-secondary', text: source };
        return <span className={`badge ${info.bg} me-1`}>{info.text}</span>;
    };

    const getActionIcon = (actionType) => {
        const icons = {
            'fill': 'bi-pencil-square',
            'click': 'bi-cursor',
            'select': 'bi-chevron-down',
            'upload': 'bi-cloud-upload',
            'check': 'bi-check-square',
            'uncheck': 'bi-square',
        };
        return icons[actionType] || 'bi-gear';
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #e8590c 100%)' }}>
                        <div>
                            <h5 className="modal-title text-white mb-0">
                                <i className="bi bi-robot me-2"></i>
                                Application Review
                            </h5>
                            {run && (
                                <small className="text-white-50">
                                    {run.job_company} — {run.job_position}
                                </small>
                            )}
                        </div>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner />
                                <p className="mt-2 text-muted">Loading application details...</p>
                            </div>
                        ) : !run ? (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="mt-2 text-muted">No pending review found for this job.</p>
                            </div>
                        ) : (
                            <>
                                {/* Summary Cards */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center py-3">
                                                <div className="text-muted small">Platform</div>
                                                <div className="fw-bold">{run.apply_type || 'Unknown'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center py-3">
                                                <div className="text-muted small">Steps Taken</div>
                                                <div className="fw-bold">{run.steps?.length || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className={`card border-0 ${run.had_fresh_decisions ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                                            <div className="card-body text-center py-3">
                                                <div className="text-muted small">LLM Decisions</div>
                                                <div className="fw-bold">
                                                    {run.had_fresh_decisions ? (
                                                        <span className="text-warning">
                                                            <i className="bi bi-exclamation-triangle me-1"></i>Yes
                                                        </span>
                                                    ) : (
                                                        <span className="text-success">
                                                            <i className="bi bi-check-circle me-1"></i>All Cached
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center py-3">
                                                <div className="text-muted small">Auto-Submit</div>
                                                <div className="fw-bold">
                                                    {run.auto_submit_eligible ? (
                                                        <span className="text-success">Eligible</span>
                                                    ) : (
                                                        <span className="text-muted">Needs Review</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Escalation Warning */}
                                {run.escalation_reason && (
                                    <div className="alert alert-warning d-flex align-items-center mb-4">
                                        <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                        <div>
                                            <strong>Escalation Reason:</strong> {run.escalation_reason}
                                        </div>
                                    </div>
                                )}

                                {/* Steps Timeline */}
                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-list-check me-2"></i>
                                    Actions Taken
                                </h6>

                                {run.steps?.length === 0 ? (
                                    <p className="text-muted">No steps recorded yet.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '40px' }}>#</th>
                                                    <th style={{ width: '100px' }}>Source</th>
                                                    <th style={{ width: '100px' }}>Action</th>
                                                    <th>Field</th>
                                                    <th>Value</th>
                                                    <th style={{ width: '80px' }}>Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {run.steps?.map((step, idx) => (
                                                    <tr key={step.id || idx} className={step.success ? '' : 'table-danger'}>
                                                        <td className="text-muted">{step.step_number}</td>
                                                        <td>{getSourceBadge(step.source)}</td>
                                                        <td>
                                                            <i className={`bi ${getActionIcon(step.action_type)} me-1`}></i>
                                                            {step.action_type}
                                                        </td>
                                                        <td>
                                                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                                                {step.action_detail?.field_label || step.action_detail?.field_purpose || '—'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="text-truncate d-inline-block text-muted" style={{ maxWidth: '200px' }}>
                                                                {step.action_detail?.value_source || '—'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {step.success ? (
                                                                <span className="badge bg-success">
                                                                    <i className="bi bi-check"></i> OK
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-danger" title={step.error_message}>
                                                                    <i className="bi bi-x"></i> Fail
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Screenshot Preview */}
                                {run.steps?.some(s => s.screenshot) && (
                                    <div className="mt-3">
                                        <h6 className="fw-bold mb-2">
                                            <i className="bi bi-image me-2"></i>Screenshots
                                        </h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {run.steps.filter(s => s.screenshot).map((step, idx) => (
                                                <a key={idx} href={step.screenshot} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={step.screenshot}
                                                        alt={`Step ${step.step_number}`}
                                                        className="rounded border"
                                                        style={{ height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer with actions */}
                    {run && (
                        <div className="modal-footer">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleReject}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === 'reject' ? (
                                    <><span className="spinner-border spinner-border-sm me-1"></span>Rejecting...</>
                                ) : (
                                    <><i className="bi bi-x-circle me-1"></i>Reject & Revert</>
                                )}
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleApprove}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === 'approve' ? (
                                    <><span className="spinner-border spinner-border-sm me-1"></span>Approving...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i>Approve & Submit</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ApplicationReviewModal;
