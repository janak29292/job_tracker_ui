function ChannelAnalysis({ data }) {
    if (!data || !data.channels) {
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

    const getChannelColor = (channel) => {
        const colors = {
            'LinkedIn': 'primary',
            'Naukri': 'success',
            'Direct': 'warning',
            'Referral': 'danger',
        };
        return colors[channel] || 'secondary';
    };

    return (
        <div className="card h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Channel Performance
                </h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Channel</th>
                                <th className="text-center">Applications</th>
                                <th className="text-center">Responses</th>
                                <th className="text-center">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.channels.map((channel, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className={`badge bg-${getChannelColor(channel.name)} me-2`}>
                                            {channel.name}
                                        </span>
                                    </td>
                                    <td className="text-center">{channel.applications}</td>
                                    <td className="text-center">{channel.responses}</td>
                                    <td className="text-center">
                                        <strong>{channel.response_rate.toFixed(1)}%</strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Best Channel Highlight */}
                {data.channels.length > 0 && (
                    <div className="alert alert-info mt-3 mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Best Channel:</strong> {
                            data.channels.reduce((best, current) =>
                                current.response_rate > best.response_rate ? current : best
                            ).name
                        } with {
                            data.channels.reduce((best, current) =>
                                current.response_rate > best.response_rate ? current : best
                            ).response_rate.toFixed(1)
                        }% response rate
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChannelAnalysis;
