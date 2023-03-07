import axios from "axios";

const configValue : string | undefined  = process.env.REACT_APP_API

export const register = async (value:any) =>
  await axios.post(configValue + "/register", value);

export const login = async (value:any) =>
  await axios.post(configValue + "/log", value);

export const currentUser = async (authtoken:any) => {
  return await axios.post(
    configValue + "/currentuser",
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};
