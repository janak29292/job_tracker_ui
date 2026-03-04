import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetricsCards from './metrics_cards';
import ChannelAnalysis from './channel_analysis';
import TechDemand from './tech_demand';
import StatusFunnel from './status_funnel';
import ApplicationVelocity from './velocity_tracker';
import StatusTrends from './status_trends';

function AnalyticsDashboard() {
    const dispatch = useDispatch();

    const analyticsSummary = useSelector(state => state.analyticsSummary?.data?.body);
    const channelPerformance = useSelector(state => state.channelPerformance?.data?.body);
    const techDemand = useSelector(state => state.techDemand?.data?.body);
    const velocity = useSelector(state => state.applicationVelocity?.data?.body);
    const ghosting = useSelector(state => state.ghostingAnalysis?.data?.body);

    useEffect(() => {
        // Fetch all analytics data
        dispatch({ type: 'GET_ANALYTICS_SUMMARY', params: {} });
        dispatch({ type: 'GET_CHANNEL_PERFORMANCE', params: {} });
        dispatch({ type: 'GET_TECH_DEMAND', params: {} });
        dispatch({ type: 'GET_APPLICATION_VELOCITY', params: {} });
        dispatch({ type: 'GET_GHOSTING_ANALYSIS', params: {} });
    }, [dispatch]);

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Analytics Dashboard
                </h2>
            </div>

            {/* Metrics Cards */}
            <MetricsCards data={analyticsSummary} />

            {/* Status Trends Chart */}
            <div className="row mt-4">
                {/* Application Velocity */}
                <div className="col-lg-6 mb-4">
                    <ApplicationVelocity data={velocity} />
                </div>
                <div className="col-lg-6 mb-4">
                    <StatusTrends />
                </div>
                {/* Channel Performance */}
                <div className="col-lg-6 mb-4">
                    <ChannelAnalysis data={channelPerformance} />
                </div>

                {/* Status Funnel */}
                <div className="col-lg-6 mb-4">
                    <StatusFunnel data={analyticsSummary} ghosting={ghosting} />
                </div>
                {/* Tech Stack Demand */}
                <div className="col-lg-6 mb-4">
                    <TechDemand data={techDemand} />
                </div>

            </div>
        </div>
    );
}

export default AnalyticsDashboard;
