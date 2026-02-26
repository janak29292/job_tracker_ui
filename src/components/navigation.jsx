import { Link, useLocation } from 'react-router-dom';

function Navigation() {
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: ' Jobs', icon: 'bi-briefcase' },
        { path: '/analytics', label: 'Analytics', icon: 'bi-graph-up' },
        { path: '/tech-tracker', label: 'Tech Skills', icon: 'bi-code-square' },
        { path: '/interview-prep', label: 'Interview Prep', icon: 'bi-lightbulb' },
        { path: '/answer-bank', label: 'Answer Bank', icon: 'bi-chat-quote' },
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">
                    <i className="bi bi-clipboard-check me-2"></i>
                    Job Tracker
                </span>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <Link 
                                    to={item.path} 
                                    className={`nav-link ${location.pathname === item.path ? 'active fw-bold' : ''}`}
                                >
                                    <i className={`bi ${item.icon} me-1`}></i>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
