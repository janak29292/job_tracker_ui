import UnstructuredTab from '../interview_prep/unstructured_tab';

function AnswerBank() {
    return (
        <div className="container-fluid px-4 py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="mb-0">
                    <i className="bi bi-chat-quote me-2"></i>
                    Answer Bank
                </h2>
            </div>

            <UnstructuredTab />
        </div>
    );
}

export default AnswerBank;
