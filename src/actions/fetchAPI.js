// export const urlapi = "http://localhost:3000";
// export const urlapi = "http://203.150.245.35:3500";
export const urlapi = "https://vrswebapi.ttrs.in.th";
var needle = require('needle');

export const sendLog = (data) => {
    fetch(`${urlapi}/send/log`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            data : data
        })
    })
    .then((response) => {return response.json();})
    .then((data) => {
    });
}

export const callLog = (data, callback) => {
    fetch(`${urlapi}/access/calllog`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            token : data.token,
            accuracy : data.accuracy,
            latitude : data.latitude,
            longitude : data.longitude
        })
    })
    .then((response) => {return response.json();})
    .then((data) => {
        callback(data) 
    });
}
export const savelocation = (data, callback) => {
    fetch(`${urlapi}/location/savelocation`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            extension : data.extension,
            accuracy : data.accuracy,
            latitude : data.latitude,
            longitude : data.longitude
        })
    })
    .then((response) => {return response.json();})
    .then((data) => {
        callback({}) 
    });
}

export const getSetting = (token, callback) => {
    fetch(`${urlapi}/setting`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({token:token})
    })
    .then((response) => {return response.json();})
    .then((data) => {
        callback(data)
    });
}

export const verifyToken = (token, callback) => {

    fetch(`${urlapi}/verify`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            token : token
        })
    })
    .then((response) => {return response.json();})
    .then((data) => {
        callback(data)
    });
}

export const loginTTRS = (username, password, callback) => {

    needle.post('203.150.245.35.nip.io/login', {
        type : "webrtc",
        username, 
        password,
    }, (error, result) => {
        callback(result.body)
    });
}
export const logoutTTRS = (token) => {
    needle.post('203.150.245.35.nip.io/logout', {
        token : token
    }, (error, result) => {
    });
}

export const reToken = (data, callback) => {
    needle.post('203.150.245.35.nip.io/refetch', {
        token : data,
    }, (error, result) => {
        callback(result.body)
    });
}

export const verifyAuth = (token, callback) => {
    fetch(`${urlapi}/auth/verifyauth`, {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            token
        })
    })
    .then((response) => {return response.json();})
    .then((data) => {
        callback(data) 
    });
}
