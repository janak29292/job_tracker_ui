import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DSAPatterns from './dsa_patterns';
import UnstructuredTab from './unstructured_tab';

function InterviewPrep() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('patterns');

    const categoryResponse = useSelector(state => state.dsaList?.data?.body);

    useEffect(() => {
        dispatch({ type: 'GET_DSA_LIST', params: {} });
    }, [dispatch]);

    return (
        <div className="container-fluid px-4 py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="mb-0">
                    <i className="bi bi-lightbulb me-2"></i>
                    Interview Preparation
                </h2>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-2">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'patterns' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patterns')}
                    >
                        <i className="bi bi-diagram-3 me-2"></i>
                        DSA Patterns
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'unstructured' ? 'active' : ''}`}
                        onClick={() => setActiveTab('unstructured')}
                    >
                        <i className="bi bi-journal-text me-2"></i>
                        Unstructured Notes
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'patterns' && <DSAPatterns categoryList={categoryResponse || []} />}
            {activeTab === 'unstructured' && <UnstructuredTab />}
        </div>
    );
}

export default InterviewPrep;
