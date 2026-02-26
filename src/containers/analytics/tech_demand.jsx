function TechDemand({ data }) {
    if (!data || !data.tech_demand) {
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

    const topTech = data.tech_demand.slice(0, 10);

    return (
        <div className="card h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">
                    <i className="bi bi-code-slash me-2"></i>
                    Most Demanded Technologies
                </h5>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush">
                    {topTech.map((tech, index) => (
                        <div className="list-group-item px-0 d-flex justify-content-between align-items-center" key={index}>
                            <div className="d-flex align-items-center flex-grow-1">
                                <span className="badge bg-primary me-3">{index + 1}</span>
                                <span className="fw-semibold">{tech.name}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">{tech.count} jobs</small>
                                <div className="progress" style={{ width: '100px', height: '8px' }}>
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${tech.percentage}%` }}
                                        aria-valuenow={tech.percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <small className="ms-2 fw-bold">{tech.percentage.toFixed(0)}%</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TechDemand;
