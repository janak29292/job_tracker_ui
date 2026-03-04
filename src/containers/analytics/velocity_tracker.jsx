function ApplicationVelocity({ data }) {
    if (!data) {
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

    const progressPercentage = data.target > 0 ? (data.actual / data.target * 100) : 0;
    const isOnTrack = data.actual >= data.target;

    return (
        <div className="card h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Application Velocity
                </h5>
            </div>
            <div className="card-body">
                {/* Progress Summary */}
                <div className="row mb-4">
                    <div className="col-6 text-center">
                        <h3 className="mb-0 text-primary">{data.actual}</h3>
                        <small className="text-muted">Applications</small>
                    </div>
                    <div className="col-6 text-center">
                        <h3 className="mb-0 text-secondary">{data.target}</h3>
                        <small className="text-muted">Target</small>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="progress" style={{ height: '25px' }}>
                        <div
                            className={`progress-bar ${isOnTrack ? 'bg-success' : 'bg-warning'}`}
                            role="progressbar"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            aria-valuenow={progressPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {progressPercentage.toFixed(0)}%
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className={`alert ${isOnTrack ? 'alert-success' : 'alert-warning'} mb-3`}>
                    <i className={`bi ${isOnTrack ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                    {isOnTrack ?
                        `Great! You're ${data.actual - data.target} applications ahead of your ${data.period}ly target!` :
                        `${data.target - data.actual} more applications needed to reach your ${data.period}ly target of ${data.target}.`
                    }
                </div>

                {/* Daily Breakdown */}
                {data.daily_breakdown && data.daily_breakdown.length > 0 && (
                    <div>
                        <h6 className="mb-2">Recent Activity</h6>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th className="text-center">Applications</th>
                                        <th className="text-center">Target</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.daily_breakdown.slice(0, 7).map((day, index) => (
                                        <tr key={index} className={day.applications === null ? 'text-muted' : ''}>
                                            <td>{new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                                            <td className="text-center">{day.applications !== null ? day.applications : '–'}</td>
                                            <td className="text-center">{day.target}</td>
                                            <td className="text-center">
                                                {day.applications !== null ? (
                                                    day.applications >= day.target ?
                                                        <i className="bi bi-check-circle-fill text-success"></i> :
                                                        <i className="bi bi-x-circle-fill text-danger"></i>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApplicationVelocity;
