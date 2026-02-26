import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { toast } from 'react-toastify';
import { useUpdateEffect } from '../../utils/helpers';

function ApproachForm({ approach, patternId, onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: '',
        description: '',
        time_complexity: '',
        space_complexity: '',
        code_example: '',
        code_result: ''
    });

    // Only keep executeCode selector — for code running feedback
    const executeCode = useSelector(state => state.executeCode);

    const isEditing = !!approach;

    useEffect(() => {
        if (approach) {
            setForm({
                name: approach.name || '',
                description: approach.description || '',
                time_complexity: approach.time_complexity || '',
                space_complexity: approach.space_complexity || '',
                code_example: approach.code_example || '',
                code_result: approach.code_result || ''
            });
        }
    }, [approach]);

    // Handle code execution response
    useUpdateEffect(() => {
        if (executeCode?.changingStatus === 'success' && executeCode?.data?.body) {
            const { output, error } = executeCode.data.body;
            if (error) {
                toast.error(error, { autoClose: 5000 });
            }
            if (output) {
                setForm(prev => ({ ...prev, code_result: output.trim() }));
                toast.success('Code executed successfully');
            }
        } else if (executeCode?.changingStatus === 'failed') {
            toast.error(executeCode?.data?.message || 'Code execution failed');
        }
    }, [executeCode?.changingStatus]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleRun = () => {
        if (!form.code_example.trim()) {
            toast.warning('No code to run');
            return;
        }
        dispatch({
            type: 'EXECUTE_CODE',
            payload: { code: form.code_example }
        });
    };

    const handleSave = () => {
        if (!form.name.trim()) {
            toast.warning('Approach name is required');
            return;
        }
        const payload = { ...form, pattern: patternId };
        if (isEditing) {
            dispatch({ type: 'UPDATE_APPROACH', payload, key: approach.id });
        } else {
            dispatch({ type: 'ADD_APPROACH', payload });
        }
    };

    const isRunning = executeCode?.changingStatus === 'ongoing';

    return (
        <div className="card border-primary">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                    <i className={`bi bi-${isEditing ? 'pencil' : 'plus-circle'} me-2`}></i>
                    {isEditing ? 'Edit Approach' : 'New Approach'}
                </h6>
                <button className="btn btn-sm btn-outline-light" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    {/* Name */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Opposite Ends, Sliding Window"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Brief description of this approach"
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Complexity */}
                    <div className="col-6">
                        <label className="form-label fw-semibold">Time Complexity</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. O(n)"
                            value={form.time_complexity}
                            onChange={e => handleChange('time_complexity', e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label fw-semibold">Space Complexity</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. O(1)"
                            value={form.space_complexity}
                            onChange={e => handleChange('space_complexity', e.target.value)}
                        />
                    </div>

                    {/* Code Editor */}
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label fw-semibold mb-0">
                                <i className="bi bi-code-slash me-1"></i> Code Example (Python)
                            </label>
                            <button
                                className="btn btn-sm btn-success"
                                onClick={handleRun}
                                disabled={isRunning}
                            >
                                {isRunning ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-play-fill me-1"></i>
                                        Run
                                    </>
                                )}
                            </button>
                        </div>
                        <CodeMirror
                            value={form.code_example}
                            height="200px"
                            theme="dark"
                            extensions={[python()]}
                            onChange={(value) => handleChange('code_example', value)}
                            style={{ borderRadius: '6px', overflow: 'hidden' }}
                        />
                    </div>

                    {/* Code Result */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">
                            <i className="bi bi-terminal me-1"></i> Result
                        </label>
                        <textarea
                            className="form-control font-monospace bg-light"
                            rows={3}
                            placeholder="Click Run to auto-populate, or type manually"
                            value={form.code_result}
                            onChange={e => handleChange('code_result', e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-outline-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className={`bi bi-${isEditing ? 'check-lg' : 'plus-lg'} me-1`}></i>
                        {isEditing ? 'Update' : 'Add'} Approach
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApproachForm;
