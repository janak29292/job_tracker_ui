// export const url = 'https://ec2-3-106-166-32.ap-southeast-2.compute.amazonaws.com/api/'
// export const url = 'http://localhost:8000/'
// export const url = 'http://192.168.1.103:8000/'
export const url = `http://${window.location.hostname}:8000/`;
export const JOB_STATUS = {
    IG: {
        text: "Ignored",
        bgColor: "secondary",
        hexColor: "#6c757d",
        chartColor: "#94a3b8",
        color: "dark",
        options: ['NA', 'IG']
    },
    NA: {
        text: "Not Applied",
        bgColor: "warning",
        hexColor: "#ffc107",
        chartColor: "#f59e0b",
        color: "dark",
        options: ['NA', 'AF', 'CR', 'IS', 'RP', 'NE', 'RE', 'OR', 'AC']
    },
    AF: {
        text: "Applied For",
        bgColor: "info",
        hexColor: "#0dcaf0",
        chartColor: "#3b82f6",
        color: "dark",
        options: ['AF', 'CR', 'IS', 'RP', 'NE', 'RE', 'OR', 'AC']
    },
    CR: {
        text: "Call Received",
        bgColor: "primary",
        hexColor: "#0d6efd",
        chartColor: "#8b5cf6",
        color: "light",
        options: ['CR', 'IS', 'RP', 'NE', 'RE', 'OR']
    },
    IS: {
        text: "Interview Scheduled",
        bgColor: "primary",
        hexColor: "#0d6efd",
        chartColor: "#06b6d4",
        color: "light",
        options: ['IS', 'RP', 'NE', 'RE', 'OR']
    },
    RP: {
        text: "Response Pending",
        bgColor: "primary",
        hexColor: "#0d6efd",
        chartColor: "#f97316",
        color: "light",
        options: ['CR', 'IS', 'RP', 'NE', 'RE', 'OR', 'AC']
    },
    NE: {
        text: "Negotiating",
        bgColor: "primary",
        hexColor: "#0d6efd",
        chartColor: "#ec4899",
        color: "light",
        options: ['IS', 'RP', 'NE', 'RE', 'OR']
    },
    RE: {
        text: "Rejected",
        bgColor: "danger",
        hexColor: "#dc3545",
        chartColor: "#ef4444",
        color: "light",
        options: ['RE', "NA"]
    },
    OR: {
        text: "Offer Received",
        bgColor: "success",
        hexColor: "#198754",
        chartColor: "#22c55e",
        color: "light",
        options: ['NE', 'OR']
    },
    AC: {
        text: "Application Closed",
        bgColor: "danger",
        hexColor: "#dc3545",
        chartColor: "#64748b",
        color: "light",
        options: ["AC", "NA"]
    }
}
export const JOB_STATUS_EXCLUDE = ['IG', 'RE', 'OR', 'AC']

export const PLATFORMS = {
    'LI': {
        name: 'LinkedIn',
        color: 'primary',
        hexColor: '#0d6efd'
    },
    'NI': {
        name: 'Naukri',
        color: 'success',
        hexColor: '#198754'
    },
    'RAW': {
        name: 'Raw Data',
        color: 'secondary',
        hexColor: '#6c757d'
    },
    'Referral': {
        name: 'Referral',
        color: 'danger',
        hexColor: '#dc3545'
    },
    'Direct': {
        name: 'Direct',
        color: 'warning',
        hexColor: '#ffc107'
    }
}