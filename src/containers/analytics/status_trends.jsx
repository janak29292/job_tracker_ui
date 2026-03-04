import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { JOB_STATUS } from '../../utils/constants';

const RANGE_PRESETS = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
];

const FREQUENCIES = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'quarter', label: 'Quarterly' },
    { value: 'year', label: 'Yearly' },
];

const getStatusColor = (code) => {
    return JOB_STATUS[code]?.chartColor || '#6c757d';
};

// Statuses visible by default
const DEFAULT_VISIBLE = ['AF', 'RE'];

function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function StatusTrends() {
    const dispatch = useDispatch();
    const trendData = useSelector(state => state.statusTrends?.data?.body);
    const isLoading = useSelector(state => state.statusTrends?.changingStatus === 'ongoing');

    // --- Controls state ---
    const [activePreset, setActivePreset] = useState(7);
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return formatDate(d);
    });
    const [dateTo, setDateTo] = useState(() => formatDate(new Date()));
    const [frequency, setFrequency] = useState('day');
    const [visibleStatuses, setVisibleStatuses] = useState(new Set(DEFAULT_VISIBLE));

    // When a preset button is clicked
    const handlePreset = (days) => {
        setActivePreset(days);
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - days);
        setDateFrom(formatDate(from));
        setDateTo(formatDate(to));
    };

    // When custom dates are typed
    const handleCustomDate = (field, value) => {
        setActivePreset(null);
        if (field === 'from') setDateFrom(value);
        else setDateTo(value);
    };

    // Fetch data whenever controls change
    useEffect(() => {
        if (dateFrom && dateTo) {
            dispatch({
                type: 'GET_STATUS_TRENDS',
                params: { date_from: dateFrom, date_to: dateTo, frequency },
            });
        }
    }, [dispatch, dateFrom, dateTo, frequency]);

    // Toggle a status line
    const toggleStatus = (code) => {
        setVisibleStatuses(prev => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
    };

    // Derive the list of all statuses present in the data
    const allStatuses = useMemo(() => {
        if (!trendData?.length) return Object.keys(JOB_STATUS);
        const keys = new Set();
        trendData.forEach(row => {
            if (row.status_breakdown) {
                Object.keys(row.status_breakdown).forEach(k => keys.add(k));
            }
        });
        return Array.from(keys);
    }, [trendData]);

    // Flatten status_breakdown into each row so Recharts can read dataKey directly
    const chartData = useMemo(() => {
        if (!trendData?.length) return [];
        return trendData.map(row => ({
            period: row.period,
            ...(row.status_breakdown || {}),
        }));
    }, [trendData]);

    // Format x-axis tick
    const formatXTick = (value) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="card h-100">
            <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 className="mb-0">
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    Status Trends
                </h5>

                {/* Frequency selector */}
                <div className="d-flex align-items-center gap-2">
                    <small className="text-muted me-1">Frequency:</small>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        value={frequency}
                        onChange={e => setFrequency(e.target.value)}
                    >
                        {FREQUENCIES.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card-body">
                {/* Date range controls */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    {/* Preset buttons */}
                    <div className="btn-group btn-group-sm" role="group">
                        {RANGE_PRESETS.map(p => (
                            <button
                                key={p.days}
                                type="button"
                                className={`btn ${activePreset === p.days ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handlePreset(p.days)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Custom date inputs */}
                    <div className="d-flex align-items-center gap-1 ms-auto">
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFrom}
                            onChange={e => handleCustomDate('from', e.target.value)}
                            style={{ width: '140px' }}
                        />
                        <span className="text-muted">–</span>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateTo}
                            onChange={e => handleCustomDate('to', e.target.value)}
                            style={{ width: '140px' }}
                        />
                    </div>
                </div>

                {/* Chart */}
                <div style={{ width: '100%', height: 320 }}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                            <div className="text-center">
                                <i className="bi bi-bar-chart-line" style={{ fontSize: '2.5rem' }}></i>
                                <p className="mt-2 mb-0">No trend data available for the selected range.</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis
                                    dataKey="period"
                                    tickFormatter={formatXTick}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    labelFormatter={formatXTick}
                                    contentStyle={{ fontSize: 13, borderRadius: 8 }}
                                />
                                {allStatuses.map(code => (
                                    visibleStatuses.has(code) && (
                                        <Bar
                                            key={code}
                                            dataKey={code}
                                            name={JOB_STATUS[code]?.text || code}
                                            fill={getStatusColor(code)}
                                            stackId="status"
                                        />
                                    )
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Status toggle badges */}
                <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
                    <small className="text-muted me-1 align-self-center">Toggle:</small>
                    {allStatuses.map(code => {
                        const isOn = visibleStatuses.has(code);
                        const label = JOB_STATUS[code]?.text || code;
                        const codeColor = getStatusColor(code);
                        return (
                            <button
                                key={code}
                                type="button"
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: isOn ? codeColor : 'transparent',
                                    color: isOn ? '#fff' : codeColor,
                                    border: `1.5px solid ${codeColor}`,
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    fontSize: '0.78rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    opacity: isOn ? 1 : 0.6,
                                }}
                                onClick={() => toggleStatus(code)}
                                title={isOn ? `Hide ${label}` : `Show ${label}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StatusTrends;
