function MetricsCards({ data }) {
    if (!data) {
        return (
            <div className="row">
                <div className="col-12 text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        {
            title: 'Total Applications',
            value: data.total_applications || 0,
            icon: 'bi-briefcase-fill',
            color: 'primary',
        },
        {
            title: 'Response Rate',
            value: `${(data.response_rate || 0).toFixed(1)}%`,
            icon: 'bi-reply-fill',
            color: 'success',
        },
        {
            title: 'Avg Days to Response',
            value: (data.avg_days_to_response || 0).toFixed(1),
            icon: 'bi-clock-fill',
            color: 'info',
        },
        {
            title: 'Interview Conversion',
            value: `${(data.interview_conversion_rate || 0).toFixed(1)}%`,
            icon: 'bi-person-video3',
            color: 'warning',
        },
    ];

    return (
        <div className="row">
            {metrics.map((metric, index) => (
                <div className="col-lg-3 col-md-6 mb-3" key={index}>
                    <div className={`card border-${metric.color} h-100`}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small">{metric.title}</p>
                                    <h3 className="mb-0">{metric.value}</h3>
                                </div>
                                <div className={`text-${metric.color}`}>
                                    <i className={`bi ${metric.icon}`} style={{ fontSize: '2rem' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MetricsCards;
