function ProblemTracker({ problems }) {
    if (!problems || !problems.problems) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const allProblems = problems.problems || [];

    const difficultyColors = {
        'Easy': 'success',
        'Medium': 'warning',
        'Hard': 'danger'
    };

    const renderStars = (confidence) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`bi bi-star${i < confidence ? '-fill' : ''} text-warning`}
            ></i>
        ));
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Problem</th>
                                <th>Platform</th>
                                <th>Pattern</th>
                                <th>Difficulty</th>
                                <th>Solved</th>
                                <th>Confidence</th>
                                <th>Last Attempted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProblems.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-2">No problems tracked yet</p>
                                    </td>
                                </tr>
                            ) : (
                                allProblems.map((problem) => (
                                    <tr key={problem.id}>
                                        <td className="fw-semibold">{problem.name}</td>
                                        <td>
                                            <span className="badge bg-secondary">{problem.platform}</span>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary">{problem.pattern_name}</span>
                                        </td>
                                        <td>
                                            <span className={`badge bg-${difficultyColors[problem.difficulty]}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            {problem.solved ? (
                                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.2rem' }}></i>
                                            ) : (
                                                <i className="bi bi-circle text-muted" style={{ fontSize: '1.2rem' }}></i>
                                            )}
                                        </td>
                                        <td>{renderStars(problem.confidence || 0)}</td>
                                        <td>
                                            {problem.last_attempted ? (
                                                <small>{new Date(problem.last_attempted).toLocaleDateString('en-IN')}</small>
                                            ) : (
                                                <small className="text-muted">Never</small>
                                            )}
                                        </td>
                                        <td>
                                            {problem.url && (
                                                <a
                                                    href={problem.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-box-arrow-up-right"></i>
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Stats */}
                {allProblems.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-md-3">
                            <div className="border rounded p-3 text-center">
                                <h4 className="mb-0 text-primary">
                                    {allProblems.filter(p => p.solved).length}
                                </h4>
                                <small className="text-muted">Solved</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 text-center">
                                <h4 className="mb-0 text-success">
                                    {allProblems.filter(p => p.difficulty === 'Easy' && p.solved).length}
                                </h4>
                                <small className="text-muted">Easy</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 text-center">
                                <h4 className="mb-0 text-warning">
                                    {allProblems.filter(p => p.difficulty === 'Medium' && p.solved).length}
                                </h4>
                                <small className="text-muted">Medium</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 text-center">
                                <h4 className="mb-0 text-danger">
                                    {allProblems.filter(p => p.difficulty === 'Hard' && p.solved).length}
                                </h4>
                                <small className="text-muted">Hard</small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProblemTracker;
