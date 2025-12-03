// export const url = 'https://ec2-3-106-166-32.ap-southeast-2.compute.amazonaws.com/api/'
export const url = 'http://localhost:8000/'
export const JOB_STATUS = {
    IG: {
        text:"Ignored",
        bgColor:"secondary",
        color:"dark",
        options:['NA', 'IG']
    },
    NA:  {
        text:"Not Applied",
        bgColor:"warning",
        color:"dark",
        options:['NA', 'AF', 'CR', 'IS', 'RP', 'NE', 'RE', 'OR']
    },
    AF: {
        text:"Applied",
        bgColor:"info",
        color:"dark",
        options:['AF', 'CR', 'IS', 'RP', 'NE', 'RE', 'OR']
    },
    CR: {
        text:"Call Received",
        bgColor:"primary",
        color:"light",
        options:['CR', 'IS', 'RP', 'NE', 'RE', 'OR']
    },
    IS: {
        text:"Interview Scheduled",
        bgColor:"primary",
        color:"light",
        options:['IS', 'RP', 'NE', 'RE', 'OR']
    },
    RP: {
        text:"Response Pending",
        bgColor:"primary",
        color:"light",
        options:['CR', 'IS', 'RP', 'NE', 'RE', 'OR']
    },
    NE: {
        text:"Negotiating",
        bgColor:"primary",
        color:"light",
        options:['IS', 'RP', 'NE', 'RE', 'OR']
    },
    RE: {
        text:"Rejected",
        bgColor:"danger",
        color:"light",
        options:['RE',]
    },
    OR: {
        text:"Offer Received",
        bgColor:"success",
        color:"light",
        options:['NE', 'OR']
    }
}