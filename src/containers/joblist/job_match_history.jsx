import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateEffect } from '../../utils/helpers';

const renderImportanceBadge = (importance) => {
    switch(importance) {
        case 'CRITICAL': return <span className="badge bg-danger me-2 mb-1" style={{fontSize: '0.65rem'}}><i className="bi bi-exclamation-triangle-fill"></i> Critical</span>;
        case 'IMPORTANT': return <span className="badge bg-primary me-2 mb-1" style={{fontSize: '0.65rem'}}><i className="bi bi-info-circle-fill"></i> Important</span>;
        case 'NICE_TO_HAVE': return <span className="badge bg-secondary me-2 mb-1" style={{fontSize: '0.65rem'}}>Nice to Have</span>;
        default: return <span className="badge bg-dark me-2 mb-1" style={{fontSize: '0.65rem'}}>{importance}</span>;
    }
}

const renderCoverageBadge = (coverage) => {
    switch(coverage) {
        case 'EXACT_MATCH': return <span className="badge bg-success mb-1" style={{fontSize: '0.65rem'}}><i className="bi bi-check-circle-fill"></i> Exact Match</span>;
        case 'COVERED': return <span className="badge bg-info text-dark mb-1" style={{fontSize: '0.65rem'}}>Covered</span>;
        case 'BUILDABLE': return <span className="badge bg-warning text-dark mb-1" style={{fontSize: '0.65rem'}}>Buildable</span>;
        case 'PARTIAL': return <span className="badge bg-secondary mb-1" style={{fontSize: '0.65rem'}}>Partial</span>;
        case 'WRONG_STACK': return <span className="badge bg-danger mb-1" style={{fontSize: '0.65rem'}}><i className="bi bi-x-circle-fill"></i> Wrong Stack</span>;
        case 'NO_MATCH': return <span className="badge bg-dark mb-1" style={{fontSize: '0.65rem'}}>No Match</span>;
        default: return <span className="badge bg-dark mb-1" style={{fontSize: '0.65rem'}}>{coverage}</span>;
    }
}

export default function JobMatchHistory({ jobId }) {
    const dispatch = useDispatch();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const jobMatchHistory = useSelector(state => state.jobMatchHistory);

    useEffect(() => {
        dispatch({ 
            type: 'GET_JOB_MATCH_HISTORY', 
            params: { job: jobId },
            key: jobId
        });
    }, [dispatch, jobId]);

    useUpdateEffect(() => {
        if (jobMatchHistory?.data?.key === jobId) {
            if (jobMatchHistory?.changingStatus === 'success') {
                setMatches(jobMatchHistory.data?.body?.results || jobMatchHistory.data?.body || []);
                setLoading(false);
            } else if (jobMatchHistory?.changingStatus === 'failed' || jobMatchHistory?.changingStatus === 'netFailed') {
                setLoading(false);
            }
        }
    }, [jobMatchHistory, jobId]);

    if (loading) {
        return <div className="text-center p-3"><div className="spinner-border spinner-border-sm text-secondary" role="status"></div></div>;
    }

    if (matches.length === 0) {
        return <div className="text-muted text-center p-3">No match history available for this job.</div>;
    }

    return (
        <div className="match-history-container mt-3">
            {matches.map((match, index) => (
                <div key={match.id} className="card mb-3 border-secondary shadow-sm">
                    <div className={`card-header d-flex justify-content-between align-items-center ${match.decision === 'APPLY' ? 'bg-success text-white' : 'bg-light text-dark'}`}>
                        <h6 className="mb-0">
                            Match #{matches.length - index} 
                            <span className="badge bg-dark ms-2">{match.match_score}% Score</span>
                        </h6>
                        <strong>{match.decision}</strong>
                    </div>
                    <div className="card-body">
                        <p className="mb-3"><strong>Reasoning:</strong> {match.reasoning}</p>
                        
                        <div className="row mb-3">
                            <div className="col-md-3"><strong>Role:</strong> {match.role_relevance}</div>
                            <div className="col-md-3"><strong>Candidate:</strong> {match.candidate_level}</div>
                            <div className="col-md-3"><strong>Job:</strong> {match.job_level}</div>
                            <div className="col-md-3"><strong>Salary:</strong> {match.salary_alignment}</div>
                        </div>

                        <hr/>
                        
                        <h6>Core Foundation</h6>
                        {match.core_foundation && (
                            <div className="alert alert-secondary p-2">
                                <div>{renderImportanceBadge(match.core_foundation.importance)} {renderCoverageBadge(match.core_foundation.coverage)}</div>
                                <strong>{match.core_foundation.area}</strong><br/>
                                <small>Needs: {match.core_foundation.job_requires?.join(', ')}</small><br/>
                                <small>Has: {match.core_foundation.candidate_has?.join(', ')}</small>
                            </div>
                        )}

                        {match.secondary_clusters && match.secondary_clusters.length > 0 && (
                            <>
                                <h6>Secondary Clusters</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {match.secondary_clusters.map(cluster => (
                                        <div key={cluster.id} className="alert alert-light border p-2 mb-0" style={{flex: '1 1 45%'}}>
                                            <div>{renderImportanceBadge(cluster.importance)} {renderCoverageBadge(cluster.coverage)}</div>
                                            <strong>{cluster.area}</strong><br/>
                                            <small>Needs: {cluster.job_requires?.join(', ')}</small><br/>
                                            <small>Has: {cluster.candidate_has?.join(', ')}</small>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="mt-4">
                            <details className="mb-2">
                                <summary className="text-muted" style={{cursor: 'pointer'}}><small>View Prompt</small></summary>
                                <pre className="bg-light p-2 mt-2 rounded border" style={{whiteSpace: 'pre-wrap', fontSize: '0.75rem', maxHeight: '300px', overflowY: 'auto'}}>
                                    {match.prompt}
                                </pre>
                            </details>
                            <details className="mb-2">
                                <summary className="text-muted" style={{cursor: 'pointer'}}><small>View Applicant Context</small></summary>
                                <pre className="bg-light p-2 mt-2 rounded border" style={{whiteSpace: 'pre-wrap', fontSize: '0.75rem', maxHeight: '300px', overflowY: 'auto'}}>
                                    {match.applicant_context}
                                </pre>
                            </details>
                            <details className="mb-2">
                                <summary className="text-muted" style={{cursor: 'pointer'}}><small>View Job Context</small></summary>
                                <pre className="bg-light p-2 mt-2 rounded border" style={{whiteSpace: 'pre-wrap', fontSize: '0.75rem', maxHeight: '300px', overflowY: 'auto'}}>
                                    {match.job_context}
                                </pre>
                            </details>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
