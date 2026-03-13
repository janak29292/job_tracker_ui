import { JOB_STATUS } from '../../utils/constants';

function StatusFunnel({ data, ghosting }) {
    if (!ghosting || !ghosting.status_breakdown) {
        return (
            <div className="card h-100">
                <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    const breakdown = (ghosting.status_breakdown || [])
        .map(({ status, count }) => {
            const statusConfig = JOB_STATUS[status] || { text: status, bgColor: 'secondary' };
            return {
                code: status,
                label: statusConfig.text,
                count,
                color: statusConfig.bgColor,
            };
        })
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);

    return (
        <div className="card h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">
                    <i className="bi bi-funnel-fill me-2"></i>
                    Application Status Breakdown
                </h5>
            </div>
            <div className="card-body">
                <div className="row g-2">
                    {breakdown.map((status, index) => (
                        <div className="col-6" key={index}>
                            <div className={`border border-${status.color} rounded p-2`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">{status.label}</small>
                                    <span className={`badge bg-${status.color}`}>{status.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ghosting Alert */}
                {ghosting && ghosting.total_ghosted > 0 && (
                    <div className="alert alert-warning mt-3 mb-0">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Heads up!</strong> {ghosting.total_ghosted} applications haven't received a response in over {ghosting.threshold_days} days.
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatusFunnel;
