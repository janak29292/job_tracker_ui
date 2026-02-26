import { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { JOB_STATUS, JOB_STATUS_EXCLUDE } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function JobFilter() {
    const dispatch = useDispatch()
    const techStackList = useSelector(state => state.techStackList)
    const { jobFilters, setJobFilters } = useAppContext()
    const [filters, setFilters] = useState(jobFilters)
    const [stacks, setStacks] = useState([])


    const addFilter = (key, value) => {
        console.log(key, value)
        setFilters({ ...filters, ...{ [key]: value } })
        // tech_stacks: selectedStack
    }

    const addFilterList = (key, value) => {
        if (key in filters && Array.isArray(filters[key])) {
            const updatedFilter = { [key]: [...filters[key], value] }
            setFilters({ ...filters, ...updatedFilter })
        } else {
            const updatedFilter = { [key]: [value] }
            setFilters({ ...filters, ...updatedFilter })
        }
    }

    const removeFilterList = (key, value) => {
        const updatedFilter = { [key]: filters[key].filter(item => item != value) }
        setFilters({ ...filters, ...updatedFilter })
    }

    const applyFilters = () => {
        setJobFilters(filters)
    }

    const resetFilters = () => {
        console.log("RESETTING")
        const currentFilters = {
            status__not__in: JOB_STATUS_EXCLUDE,
            ordering: '-last_posted'
        }
        setFilters(currentFilters)
        setJobFilters(currentFilters)
    }

    const getTechStackList = (techName) => {
        dispatch({
            type: 'GET_TECHSTACK_LIST',
            params: { name__icontains: techName }
        });
        // setLoading(true);
    };

    useEffect(() => {
        console.log(techStackList)
        if (techStackList?.data?.status === 'success') {
            setStacks(techStackList.data.body);
        } else if (techStackList?.changingStatus !== 'ongoing') {
            if (techStackList?.changingStatus === 'netFailed') {
                toast.error(techStackList.data.message);
            } else if (techStackList?.changingStatus === 'failed') {
                console.log(techStackList)
                toast.error(techStackList?.changingStatus);
            }
        }
        // setStacks(techStackList)
    }, [techStackList]);

    // console.log()
    useEffect(() => {
        if (Object.keys(jobFilters).length === 0) {
            const currentFilters = {
                status__not__in: JOB_STATUS_EXCLUDE,
                ordering: '-last_posted'
            }
            setFilters({ ...filters, ...currentFilters })
            setJobFilters(currentFilters)
        }
    }, []);



    return (

        <div className="container">

            <div class="offcanvas offcanvas-end" tabindex="-1" id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="filterOffcanvasLabel">
                        <i class="bi bi-funnel"></i> Filters & Sort
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="d-flex flex-column gap-3">

                        {/* <div>
                            <label class="form-label fw-semibold">Search</label>
                            <input type="text" class="form-control" placeholder="Search jobs..."></input>
                        </div> */}

                        <div>
                            {/* <label class="form-label fw-semibold">Tech Stack</label> */}

                            <div class="dropdown tech-input-wrapper">
                                <input type="text" onChange={e => getTechStackList(e.target.value)} class="form-control" placeholder="Search technologies..." autocomplete="off" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"></input>
                                <div class="dropdown-menu tech-dropdown" id="techDropdown">
                                    {stacks.filter(item => !filters.tech_stacks?.includes(item.name)).map((item, index) => (
                                        <div class="tech-dropdown-item">
                                            <span class="badge bg-primary" onClick={() => addFilterList('tech_stacks', item.name)}>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div class="tech-stack-container">
                                {filters.tech_stacks?.map((item, index) => (
                                    <span class="badge bg-primary selected-tech">
                                        {item} <i class="bi bi-x-circle ms-1" onClick={() => removeFilterList('tech_stacks', item)} style={{ cursor: 'pointer' }}></i>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            {/* <label class="form-label fw-semibold">Include Statuses (status__in)</label> */}
                            <div class="dropdown status-dropdown-wrapper">
                                <button class="status-trigger w-100" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                    <span class="text-muted">Select statuses to include...</span>
                                    <i class="bi bi-chevron-down"></i>
                                </button>
                                <div class="dropdown-menu status-dropdown">
                                    {Object.keys(JOB_STATUS).filter(item => !filters.status__in?.includes(item)).map((item, index) => (
                                        <div class="status-dropdown-item">
                                            <span onClick={() => addFilterList('status__in', item)} class={`badge bg-${JOB_STATUS[item].bgColor}`}>{JOB_STATUS[item].text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div class="selected-statuses-container">
                                {filters.status__in?.map((item, index) => (
                                    <span class="badge bg-success selected-tech">
                                        {JOB_STATUS[item].text} <i onClick={() => removeFilterList('status__in', item)} class="bi bi-x-circle ms-1" style={{ cursor: 'pointer' }}></i>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            {/* <label class="form-label fw-semibold">Exclude Statuses (status__not__in)</label> */}
                            <div class="dropdown status-dropdown-wrapper">
                                <button class="status-trigger w-100" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                    <span class="text-muted">Select statuses to exclude...</span>
                                    <i class="bi bi-chevron-down"></i>
                                </button>
                                <div class="dropdown-menu status-dropdown">
                                    {Object.keys(JOB_STATUS).filter(item => !filters.status__not__in?.includes(item)).map((item, index) => (
                                        <div class="status-dropdown-item">
                                            <span onClick={() => addFilterList('status__not__in', item)} class={`badge bg-${JOB_STATUS[item].bgColor}`}>{JOB_STATUS[item].text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div class="selected-statuses-container">
                                {filters.status__not__in?.map((item, index) => (
                                    <span class="badge bg-danger selected-tech">
                                        {JOB_STATUS[item].text} <i onClick={() => removeFilterList('status__not__in', item)} class="bi bi-x-circle ms-1" style={{ cursor: 'pointer' }}></i>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label class="form-label fw-semibold">Experience Range</label>
                            <div class="row g-2">
                                <div class="col-6">
                                    <input onChange={e => addFilter('experience_min__gte', e.target.value)} type="number" class="form-control" placeholder="Min" min="0"></input>
                                    <small class="text-muted">Min years</small>
                                </div>
                                <div class="col-6">
                                    <input onChange={e => addFilter('experience_max__lte', e.target.value)} type="number" class="form-control" placeholder="Max" min="0"></input>
                                    <small class="text-muted">Max years</small>
                                </div>
                            </div>
                        </div>


                        <div>
                            <label class="form-label fw-semibold">Sort By</label>
                            <select class="form-select" value={filters.ordering || ''} onChange={e => addFilter('ordering', e.target.value)}>
                                <option value="id" >ID - ascending</option>
                                <option value="-id" >ID - descending</option>
                                <option value="company" >Company - ascending</option>
                                <option value="-company" >Company - descending</option>
                                <option value="recruiter" >Recruiter - ascending</option>
                                <option value="-recruiter" >Recruiter - descending</option>
                                <option value="contact" >Contact - ascending</option>
                                <option value="-contact" >Contact - descending</option>
                                <option value="agency" >Agency - ascending</option>
                                <option value="-agency" >Agency - descending</option>
                                <option value="position" >Position - ascending</option>
                                <option value="-position" >Position - descending</option>
                                <option value="job_description" >Job description - ascending</option>
                                <option value="-job_description" >Job description - descending</option>
                                <option value="job_location" >Job location - ascending</option>
                                <option value="-job_location" >Job location - descending</option>
                                <option value="apply_url" >Apply url - ascending</option>
                                <option value="-apply_url" >Apply url - descending</option>
                                <option value="status" >Status - ascending</option>
                                <option value="-status" >Status - descending</option>
                                <option value="experience_min" >Experience min - ascending</option>
                                <option value="-experience_min" >Experience min - descending</option>
                                <option value="experience_max" >Experience max - ascending</option>
                                <option value="-experience_max" >Experience max - descending</option>
                                <option value="tech_stack_primary" >Tech stack primary - ascending</option>
                                <option value="-tech_stack_primary" >Tech stack primary - descending</option>
                                <option value="tech_stack_all" >Tech stack all - ascending</option>
                                <option value="-tech_stack_all" >Tech stack all - descending</option>
                                <option value="salary" >Salary - ascending</option>
                                <option value="-salary" >Salary - descending</option>
                                <option value="last_interaction" >Last interaction - ascending</option>
                                <option value="-last_interaction" >Last interaction - descending</option>
                                <option value="applied_on" >Applied on - ascending</option>
                                <option value="-applied_on" >Applied on - descending</option>
                                <option value="last_posted" >Last posted - ascending</option>
                                <option value="-last_posted" >Last posted - descending</option>
                            </select>
                        </div>


                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" onClick={applyFilters}>
                                <i class="bi bi-check-circle"></i> Apply Filters
                            </button>
                            <button type="button" class="btn btn-outline-secondary" onClick={resetFilters}>
                                <i class="bi bi-arrow-counterclockwise"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fab-filter filter-badge rounded-circle">
                <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#filterOffcanvas">
                    <i class="bi bi-funnel-fill"></i>
                </button>
                {/* <span class="filter-count">3</span> */}
            </div>

        </div>
    );
}

export default JobFilter;