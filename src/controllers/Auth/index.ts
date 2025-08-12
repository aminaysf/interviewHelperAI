import axios, { AxiosError } from 'axios';
import { API_URL } from '@/constants';
import { getAcessToken } from '@/utilities/storage/secrets';

const authBaseURL = `${API_URL}users/auth`;

export const verifyUserAccessApiCall = async () => {
  const accessPoint = `${authBaseURL}/verify-token`;
  const accessToken = await getAcessToken('accessToken');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.post(
      accessPoint,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Verify token error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const userLoginApiCall = async (body: {
  password: string;
  account: string;
}) => {
  const accessPoint = `${authBaseURL}/login`;
  try {
    const response = await axios.post(accessPoint, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const userSignupApiCall = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const accessPoint = `${authBaseURL}/signup`;
  try {
    const response = await axios.post(accessPoint, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('accessToken', response.data.token); // Store token
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};