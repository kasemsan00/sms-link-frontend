export const URL_API = process.env.NEXT_PUBLIC_URL_API;

export const submitRating = async ({ uuid, rate }) => {
  const response = await fetch(`${URL_API}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid,
      rate,
    }),
  });
  if (!response.ok) {
    throw new Error("Send Location Error");
  }
  return response.json();
};

export const updateUserActiveStatus = async ({ uuid, status, signal = undefined }) => {
  if (signal !== undefined && signal.aborted) {
    return false;
  }
  if (status === false) return false;
  console.log("Update User Active Status", status);
  const response = await fetch(`${URL_API}/updatestatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: signal !== undefined ? signal : null,
    body: JSON.stringify({
      uuid: uuid,
      status: status,
    }),
  });
  if (!response.ok) {
    throw new Error("UpdateUserActiveStatus Failed");
  }
  return response.json();
};

export const getExtensionDetail = async (uuid) => {
  const response = await fetch(`${URL_API}/linkdetail/${uuid}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const updateTerminateCall = async ({ uuid, signal = undefined }) => {
  if (signal !== undefined && signal.aborted) {
    return false;
  }
  const response = await fetch(`${URL_API}/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: signal !== undefined ? signal : null,
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
  const response = await fetch(`${URL_API}/savelocation`, {
    method: "POST",
    headers: {
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
  const response = await fetch(
    `${URL_API}/geolocation?latitude=${latitude}&longitude=${longitude}&token=9999&src=webrtc&language=${language}`,
    {
      signal,
    },
  );
  if (!response.ok) {
    throw new Error("Get Location Error");
  }
  return response.json();
};
export const reverseGeocode = async ({ lat, lon }) => {
  const response = await fetch(
    `https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&key=${process.env.NEXT_PUBLIC_LONGDOO_KEY}`,
  );
  if (!response.ok) {
    throw new Error("Get Geo Error");
  }
  return response.json();
};
