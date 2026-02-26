import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TechTable from './tech_table';
import AddTechForm from './add_tech_form';

function TechTracker() {
    const dispatch = useDispatch();
    const [showAddForm, setShowAddForm] = useState(false);

    const techList = useSelector(state => state.techProficiencyList?.data?.body);
    const loading = useSelector(state => state.techProficiencyList?.changingStatus === 'ongoing');

    useEffect(() => {
        dispatch({ type: 'GET_TECH_PROFICIENCY', params: {} });
    }, [dispatch]);

    const handleAddTech = (techData) => {
        dispatch({
            type: 'ADD_TECH',
            payload: techData,
            params: {}
        });
        setShowAddForm(false);
    };

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-code-square me-2"></i>
                    Technology Proficiency Tracker
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Technology
                </button>
            </div>

            {showAddForm && (
                <div className="mb-4">
                    <AddTechForm
                        onSubmit={handleAddTech}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            <TechTable
                technologies={techList?.technologies || []}
                loading={loading}
            />
        </div>
    );
}

export default TechTracker;
