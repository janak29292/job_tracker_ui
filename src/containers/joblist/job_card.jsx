import { useDispatch, useSelector } from "react-redux";
import { ConfirmIgnoreButton, EditableField } from "../../components/temp";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { JOB_STATUS } from "../../utils/constants";

function JobCard(props) {
    // let job = props.job;
    const dispatch = useDispatch();
    const jobDetails = useSelector(state => state.jobDetails)

    const [job, setJob] = useState({...props.job});

    const handlePatch = (column, value) => {

        let payload = column == 'experience_max' ? {
            experience_max: value,
            experience_min: value
        } : {[column]: value}

        dispatch({
            type: 'PATCH_JOB',
            payload,
            key: job.id
        });
    }
    useEffect(() => {
        if (jobDetails?.data?.key == job.id) {    
            if (jobDetails?.data?.status === 'success') {
                setJob({...jobDetails.data.body});
                // setLoading(false);
                // setNextParams(jobDetails.data.body.next_param_object)
                // setHasMore(!!jobDetails.data.body.next);
                toast.success("Job Updated")
            } else if (jobDetails?.changingStatus !== 'ongoing') {
                if (jobDetails?.changingStatus === 'netFailed') {
                    toast.error(jobDetails.data.message);
                } else if (jobDetails?.changingStatus === 'failed'){
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

    return(
        <div class="accordion-item job-card mb-3">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#job${job.id}`}>
                    <div class="job-header-content">
                        <div class="row align-items-center w-100">
                            <div class="col-lg-3 col-md-6 mb-2 mb-lg-0">
                                <h5 class="mb-1">{job.company}</h5>
                                <p class="text-muted mb-0 small">{job.position}</p>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-2 mb-lg-0">
                                <small class="text-muted">
                                    <i class="bi bi-geo-alt"></i> {job.job_location}
                                </small>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-2 mb-md-0">
                                <div class="d-flex flex-wrap gap-1">
                                    {JSON.parse(job.tech_stack_primary).map((tech_stack) => (
                                        <span class="badge bg-secondary tech-badge">{tech_stack}</span>
                                    ))}
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-4 mb-2 mb-md-0">
                                <span class={`badge status-badge bg-${JOB_STATUS[job.status].bgColor} text-${JOB_STATUS[job.status].color}`}>{JOB_STATUS[job.status].text}</span>
                            </div>
                            <div class="col-lg-1 col-md-2 text-end">
                                <small class="text-muted">{job.last_posted}</small>
                            </div>
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
                            <label class="form-label fw-bold">Status</label>
                            <select class="form-select form-select-sm" onChange={e => handlePatch('status', e.target.value)}>
                                {JOB_STATUS[job.status].options.map((status) => (
                                    <option value={status} selected={job.status === status}>{JOB_STATUS[status].text}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div class="col-md-6">
                            {/* <label class="form-label fw-bold">Experience Required</label>
                            <p class="mb-0">{job.experience_max}</p> */}
                            <EditableField 
                                label="Experience Required" 
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
                                {JSON.parse(job.tech_stack_all).map((tech_stack) => (
                                    <span class="badge bg-info">{tech_stack}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="d-flex gap-2 flex-wrap">
                                <a href={job.apply_url} 
                                    target="_blank" 
                                    class="btn btn-primary">
                                    <i class="bi bi-box-arrow-up-right"></i> Apply
                                </a>
                                <ConfirmIgnoreButton  
                                    onConfirm={() => handlePatch('status', 'IG')}
                                />
                            </div>
                        </div>

                        <div class="col-12">
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
    );
}

export default JobCard;