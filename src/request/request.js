import axios from "axios";

export var urlapi = process.env.NEXT_PUBLIC_URL_API;

export const uploadFile = async ({ file }) => {
    const formData = new FormData();
    formData.append("files", file);
    axios
        .post(`${process.env.NEXT_PUBLIC_URL_API}/upload/file`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(percentCompleted);
            },
        })
        .then(({ data }) => console.log(data));
};

export const updateUserActiveStatus = async ({ uuid, status, signal = undefined }) => {
    if (signal !== undefined && signal.aborted) {
        return false;
    }
    if (status === false) return false;
    // const response = await fetch(`${urlapi}/updatestatus`, {
    //     method: "POST",
    //     signal: signal !== undefined ? signal : null,
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         uuid: uuid,
    //         status: status,
    //     }),
    // });

    return null;
    //
    // if (!response.ok) {
    //     throw new Error("UpdateUserActiveStatus Failed");
    // }
    // return response.json();
};

export const getExtensionDetail = async (uuid) => {
    const response = await fetch(`${urlapi}/detail`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uuid: uuid,
        }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const updateTerminateCall = async ({ uuid }) => {
    const response = await fetch(`${urlapi}/close`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uuid: uuid,
        }),
    });
    if (!response.ok) {
        throw new Error("UpdateTerminateCall Error");
    }
    return response.json();
};
export const sendLocation = async ({ os, latitude, longitude, accuracy, uuid }) => {
    const response = await fetch(`${urlapi}/savelocation`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            os: os,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            uuid: uuid,
        }),
    });
    if (!response.ok) {
        throw new Error("Send Location Error");
    }
    return response.json();
};
export const getLocationName = async ({ latitude, longitude, signal, language }) => {
    if (signal.aborted) {
        return false;
    }
    const response = await fetch(`${urlapi}/geolocation?latitude=${latitude}&longitude=${longitude}&token=9999&src=webrtc&language=${language}`, {
        signal,
    });
    if (!response.ok) {
        throw new Error("Get Location Error");
    }
    return response.json();
};
export const rerverseGeocoding = async ({ lat, lon }) => {
    const response = await fetch(`https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&key=${process.env.NEXT_PUBLIC_LONGDOO_KEY}`);
    if (!response.ok) {
        throw new Error("Get Geo Error");
    }
    return response.json();
};
