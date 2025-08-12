import axios, { AxiosError } from "axios";
import { API_URL } from "@/constants";
import { getAcessToken } from "@/utilities/storage/secrets";
const authBaseURL: string = API_URL + "users/auth";

export const verifyUserAccessApiCall = async () => {
  const accessPoint = authBaseURL + "/verify-token"; // Line 11 (where the request is made)
  const accessToken = await getAcessToken("accessToken");

    return await axios.post(
      accessPoint,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => {
      return res;
    });;
    

};
export const userLoginApiCall = async (body: {
  password: string;
  account: string;
}) => {
  const accessPoint = authBaseURL + "/login";
  return await axios.post(accessPoint, body, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res;
  });
};

export const userSignupApiCall = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const accessPoint = authBaseURL + "/signup";
  return await axios.post(accessPoint, body, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res;
  });
};