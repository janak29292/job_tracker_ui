import { useDispatch, useSelector } from "react-redux";
import ConfirmIgnoreButton from "../../components/common/ConfirmIgnoreButton";
import EditableField from "../../components/common/EditableField";
import PostingHistoryDropdown from "../../components/jobs/PostingHistoryDropdown";
import StatusDropdown from "../../components/jobs/StatusDropdown";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { JOB_STATUS } from "../../utils/constants";
import moment from "moment";
import { useUpdateEffect } from "../../utils/helpers";
import JobMatchHistory from './job_match_history';
import ApplicationReviewModal from './application_review';

function JobCard(props) {
    // let job = props.job;
    const dispatch = useDispatch();
    const jobDetails = useSelector(state => state.jobDetails)

    const [job, setJob] = useState({ ...props.job });
    const [showMatches, setShowMatches] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const handlePatch = (column, value) => {

        let payload = column == 'experience_max' ? {
            experience_max: value,
            experience_min: value
        } : { [column]: value }

        dispatch({
            type: 'PATCH_JOB',
            payload,
            key: job.id
        });
    }

    useUpdateEffect(() => {
        if (jobDetails?.data?.key == job.id) {
            if (jobDetails?.data?.status === 'success') {
                setJob({ ...jobDetails.data.body });
                // setLoading(false);
                // setNextParams(jobDetails.data.body.next_param_object)
                // setHasMore(!!jobDetails.data.body.next);
                toast.success("Job Updated")
                dispatch({ type: 'GET_DAILY_JOB_COUNT', params: {} });
            } else if (jobDetails?.changingStatus !== 'ongoing') {
                if (jobDetails?.changingStatus === 'netFailed') {
                    toast.error(jobDetails.data.message);
                } else if (jobDetails?.changingStatus === 'failed') {
                    console.log(jobDetails)
                    toast.error(jobDetails?.changingStatus);
                }
                // setLoading(false);
            }
        }
    }, [jobDetails]);
    //     'primary'
    //     'secondary'
    //     'success'
    //     'danger'
    //     'warning'
    //     'info'
    //     'light'
    //     'dark'
    //     'muted'
    //     'white'

    return (
        <>
            <div class="accordion-item job-card mb-3">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#job${job.id}`}>
                    <div class="job-header-content">
                        <div class="row align-items-center w-100">
                            {/* Top Row: Original Layout */}
                            <div class="col-lg-3 col-md-6 mb-2 mb-lg-0 text-start">
                                <h5 class="mb-1 d-flex align-items-center gap-2">
                                    {job.platform === 'LI' && (
                                        <i className="bi bi-linkedin text-primary" style={{ fontSize: '1rem' }} title="LinkedIn"></i>
                                    )}
                                    {job.platform === 'NI' && (
                                        <img src="/naukri_favicon.ico" alt="Naukri" title="Naukri"
                                            style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                                    )}
                                    {job.company}
                                </h5>
                                {job.ratings && (
                                    <div class="mb-1">
                                        <span class="badge bg-warning text-dark border" style={{ fontSize: '0.75rem' }}>
                                            <i class="bi bi-star-fill"></i> {job.ratings}
                                        </span>
                                    </div>
                                )}
                                {job.latest_match_score != null && (
                                    <div class="mb-1">
                                        <span class={`badge ${job.latest_decision === 'APPLY' ? 'bg-success text-white' : job.latest_decision === 'REJECT' ? 'bg-danger text-white' : 'bg-warning text-dark'} border`} style={{ fontSize: '0.75rem' }}>
                                            {job.latest_match_score}% Match
                                        </span>
                                    </div>
                                )}
                                <p class="text-muted mb-0 small">{job.position}</p>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-2 mb-lg-0">
                                <small class="text-muted">
                                    <i class="bi bi-geo-alt"></i> {job.job_location}
                                </small>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-2 mb-md-0">
                                <div class="d-flex flex-wrap gap-1">
                                    {job.tech_stack_primary && JSON.parse(job.tech_stack_primary).map((tech_stack, i) => (
                                        <span key={i} class="badge bg-secondary tech-badge">{tech_stack}</span>
                                    ))}
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-4 mb-2 mb-md-0">
                                <span class={`badge status-badge bg-${JOB_STATUS[job.status].bgColor} text-${JOB_STATUS[job.status].color}`}>{JOB_STATUS[job.status].text}</span>
                                {job.status === 'PR' && (
                                    <span className="badge bg-warning text-dark ms-1">
                                        <i className="bi bi-robot"></i>
                                    </span>
                                )}
                            </div>
                            <div class="col-lg-1 col-md-2 text-end">
                                <PostingHistoryDropdown jobId={job.id} lastPostedDate={job.last_posted} />
                            </div>

                            {/* Middle Row: Full-width Role Summary */}
                            {job.role_summary && (
                                <div class="col-12 mt-2 text-start">
                                    <p class="mb-0 text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.4', whiteSpace: 'normal' }}>
                                        {job.role_summary}
                                    </p>
                                </div>
                            )}

                            {/* Extracted Fields (New Layout) */}
                            {(job.role_title || job.tech_stack_primary_new) && (
                                <>
                                    <div class="col-12">
                                        <hr class="my-2 text-muted" />
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-2 mb-lg-0 text-start">
                                        {job.role_title && (
                                            <p class="text-muted mb-1 small">{job.role_title}</p>
                                        )}
                                        <div class="d-flex align-items-center gap-2 flex-wrap">
                                            {job.seniority_level && <span class="badge bg-light text-secondary border">{job.seniority_level}</span>}
                                            {job.role_category && <span class="badge bg-light text-secondary border">{job.role_category}</span>}
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-2 mb-lg-0">
                                        {/* Spacer to align with location column */}
                                    </div>
                                    <div class="col-lg-6 col-md-12 mb-2 mb-md-0 text-start">
                                        {job.tech_stack_primary_new && (
                                            <div class="d-flex flex-wrap gap-1">
                                                {JSON.parse(job.tech_stack_primary_new).map((tech_stack, i) => (
                                                    <span key={i} class="badge bg-secondary tech-badge">{tech_stack}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </button>
            </h2>
            <div id={`job${props.job.id}`} class="accordion-collapse collapse" data-bs-parent="#jobAccordion">
                <div class="accordion-body">
                    <div class="row g-3">

                        <div class="col-md-6">
                            <EditableField
                                label="Recruiter"
                                value={job.recruiter}
                                onSave={(val) => handlePatch('recruiter', val)}
                            />
                        </div>

                        <div class="col-md-6">
                            <EditableField
                                label="Contact"
                                value={job.contact}
                                onSave={(val) => handlePatch('contact', val)}
                            />
                        </div>

                        <div class="col-md-6">
                            <EditableField
                                label="Agency"
                                value={job.agency}
                                onSave={(val) => handlePatch('agency', val)}
                            />
                        </div>

                        <div class="col-md-6">
                            <EditableField
                                label="Salary"
                                value={job.salary}
                                onSave={(val) => handlePatch('salary', val)}
                            />
                        </div>


                        <div class="col-md-6">
                            <StatusDropdown
                                currentStatus={job.status}
                                onSave={(val) => handlePatch('status', val)}
                            />
                        </div>

                        <div class="col-md-3">
                            {/* <label class="form-label fw-bold">Experience Required</label>
                            <p class="mb-0">{job.experience_max}</p> */}
                            <EditableField
                                label="Experience Min"
                                value={job.experience_min}
                                onSave={(val) => handlePatch('experience_min', val)}
                                disableIfValue={true}
                            />
                        </div>

                        <div class="col-md-3">
                            {/* <label class="form-label fw-bold">Experience Required</label>
                            <p class="mb-0">{job.experience_max}</p> */}
                            <EditableField
                                label="Experience Max"
                                value={job.experience_max}
                                onSave={(val) => handlePatch('experience_max', val)}
                                disableIfValue={true}
                            />
                        </div>


                        <div class="col-md-6">
                            <label class="form-label fw-bold">Last Interaction</label>
                            <input
                                type="date"
                                class="form-control form-control-sm"
                                value={job.last_interaction}
                                onChange={e => handlePatch('last_interaction', e.target.value)}
                            ></input>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold">Applied On</label>
                            <input
                                type="date"
                                class="form-control form-control-sm"
                                value={job.applied_on}
                                onChange={e => handlePatch('applied_on', e.target.value)}
                            ></input>
                        </div>


                        <div class="col-12">
                            <label class="form-label fw-bold">All Technologies</label>
                            <div class="d-flex flex-wrap gap-1">
                                {job.tech_stack_all && JSON.parse(job.tech_stack_all).map((tech_stack, i) => (
                                    <span key={i} class="badge bg-info">{tech_stack}</span>
                                ))}
                            </div>
                            {job.tech_stack_all_new && (
                                <>
                                    <hr class="my-2 text-muted" />
                                    <div class="d-flex flex-wrap gap-1">
                                        {JSON.parse(job.tech_stack_all_new).map((tech_stack, i) => (
                                            <span key={`new-${i}`} class="badge bg-info">{tech_stack}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div class="col-12">
                            <div class="d-flex gap-2 flex-wrap">
                                <a href={job.apply_url}
                                    target="_blank"
                                    class="btn btn-primary">
                                    <i class="bi bi-box-arrow-up-right"></i> Apply
                                </a>
                                {job.status === 'PR' && (
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => setShowReview(true)}
                                    >
                                        <i className="bi bi-robot me-1"></i>
                                        Review Application
                                    </button>
                                )}
                                <ConfirmIgnoreButton
                                    onConfirm={() => handlePatch('status', 'IG')}
                                />
                            </div>
                        </div>

                        <div class="col-12 mt-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowMatches(!showMatches)}>
                                {showMatches ? 'Hide Matches' : 'Show Matches'}
                            </button>
                        </div>
                        {showMatches && (
                            <div className="col-12 mt-2">
                                <JobMatchHistory jobId={job.id} />
                            </div>
                        )}

                        <div class="col-12 mt-3">
                            <label class="form-label fw-bold">Job Description</label>
                            <div class="card">
                                <div class="card-body">
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {job.job_description}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>

        {/* Application Review Modal */}
        {showReview && (
            <ApplicationReviewModal
                jobId={job.id}
                onClose={() => setShowReview(false)}
                onAction={(result) => {
                    // Update local card state immediately
                    if (result === 'approved') {
                        setJob({ ...job, status: 'AF' });
                    } else if (result === 'rejected') {
                        setJob({ ...job, status: 'MA' });
                    }
                    setShowReview(false);
                }}
            />
        )}
        </>
    );
}

export default JobCard;