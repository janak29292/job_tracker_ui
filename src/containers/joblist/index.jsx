// import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner";
import JobCard from "./job_card";
import JobFilter from "./joblist_filter";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "../../context/appContext";
import { useUpdateEffect } from "../../utils/helpers";

function JobList() {
    const dispatch = useDispatch();
    const jobList = useSelector(state => state.jobList)
    const dailyJobCount = useSelector(state => state.dailyJobCount)
    const { jobFilters } = useAppContext()

    const [jobs, setJobs] = useState([]);
    const [nextParams, setNextParams] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);


    const getJobList = () => {
        dispatch({
            type: 'GET_JOB_LIST',
            params: nextParams
        });
        setLoading(true);
    };

    const getMoreJobs = () => {
        console.log("getting more")
        // params = {} 
        getJobList()
    }

    const getFilteredJobs = (key, value) => {
        console.log("filtered")
        // console.log({[key]: value})
        // console.log(nextParams)
        const updatedParams = { ...nextParams, ...{ [key]: value }, ...{ cursor: [] } }
        setNextParams(updatedParams)
        setJobs([])
        dispatch({
            type: 'GET_JOB_LIST',
            params: updatedParams
        });
        setLoading(true);
    }

    useEffect(() => {
        const updatedParams = { ...nextParams, ...jobFilters, ...{ cursor: [] } }
        setNextParams(updatedParams)
        setJobs([])
        dispatch({
            type: 'GET_JOB_LIST',
            params: updatedParams
        });
        setLoading(true);
    }, [jobFilters]);

    useUpdateEffect(() => {
        if (jobList?.data?.status === 'success') {
            setJobs([...jobs, ...jobList.data.body.results]);
            setLoading(false);
            setNextParams(jobList.data.body.next_param_object)
            setHasMore(!!jobList.data.body.next);
        } else if (jobList?.changingStatus !== 'ongoing') {
            if (jobList?.changingStatus === 'netFailed') {
                toast.error(jobList.data.message);
            } else if (jobList?.changingStatus === 'failed') {
                console.log(jobList)
                toast.error(jobList?.changingStatus);
            }
            setLoading(false);
        }
    }, [jobList]);

    useEffect(() => {
        console.log('🚀 Component mounted - Initial fetch');
        getJobList({});
        // Fetch daily job count
        dispatch({ type: 'GET_DAILY_JOB_COUNT', params: {} });
    }, []);

    const handleScroll = (e) => {
        if (hasMore && !loading) {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            // console.log(scrollHeight, Math.ceil(scrollTop) + Math.ceil(clientHeight))
            if (Math.ceil(scrollTop) + Math.ceil(clientHeight) + 700 >= scrollHeight) {
                getMoreJobs();
            }
        }
    }

    return (
        <div class="container-fluid px-4">
            <div class="filter-section py-4">
                <div class="row g-3">
                    <div class="col-12">
                        {/* <label class="form-label fw-semibold">Search</label> */}
                        <div class="d-flex gap-2 align-items-center">
                            <input onChange={e => getFilteredJobs('search', e.target.value)} type="text" class="form-control" placeholder="Search jobs..." />
                            <span class="badge bg-primary" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}>
                                📋 Applied today: {dailyJobCount?.data?.body?.applied_today || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <JobFilter />

            <div class="job-list-container" onScroll={handleScroll}>
                <div class="accordion" id="jobAccordion">
                    {jobs.map((item, index) => (
                        <JobCard
                            job={item}
                        />
                    ))}
                </div>

                {hasMore && !loading ?
                    <div class="container">
                        <div class="row">
                            <div class="col text-center">
                                <button onClick={getMoreJobs} class="btn btn-primary">{jobs.length == 0 ? 'Retry' : 'Load More'}</button>
                                {/* e => {console.log(e.target.scrollHeight, Math.ceil(e.target.scrollTop) + Math.ceil(e.target.clientHeight) )} */}
                            </div>
                        </div>
                    </div>
                    : ''}
                {/* <button type="button" class="btn btn-primary">
                <i class="bi bi-check-circle"></i> 
                Apply Filters
            </button> */}
                {loading ? <div class="loading-spinner">
                    <Spinner />
                    <p class="mt-2 text-muted">Loading more jobs...</p>
                </div> : ''
                }
            </div>

            {!loading && !hasMore && jobs.length == 0 ? <div class="empty-state">
                <i class="bi bi-inbox" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                <h4 class="mt-3">No jobs found</h4>
                <p class="text-muted">Try adjusting your filters or search terms</p>
            </div> : ''
            }


        </div>
    );
}

export default JobList;