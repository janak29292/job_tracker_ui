import React, { useState } from 'react';
import UnstructuredTab from '../interview_prep/unstructured_tab';
import AutomatedQAManager from './AutomatedQAManager';

function AnswerBank() {
    const [activeTab, setActiveTab] = useState('unstructured');

    return (
        <div className="container-fluid px-4 py-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                    <i className="bi bi-chat-quote me-2"></i>
                    Answer Bank & QA Rules
                </h2>
            </div>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'unstructured' ? 'active fw-bold' : ''}`} 
                        onClick={() => setActiveTab('unstructured')}
                    >
                        Behavioral / Technical Bank
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'automated' ? 'active fw-bold' : ''}`} 
                        onClick={() => setActiveTab('automated')}
                    >
                        Automated Q&A Rules
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'unstructured' && <UnstructuredTab />}
                
                {activeTab === 'automated' && (
                    <div className="row">
                        <div className="col-12 col-xl-8">
                            <AutomatedQAManager />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnswerBank;
