import axios from "axios";

const configValue: string | undefined = process.env.REACT_APP_API

export const isImageIdIsValid = async (authtoken: any, imageId: String) => {
    return await axios.post(
        configValue + "/data/dataisvalid/" + imageId,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const matchdata = async (authtoken: any, payload: any) => {
    return await axios.post(
        configValue + "/data/match/",
        payload,
        {
            headers: {
                authtoken,
            },
        }
    );
};

