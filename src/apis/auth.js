import { axiosClient } from './axiosClient';

export const login = async ({ phone, password }) => {
  return axiosClient.post('/auth/login', { phone, password });
};

export const register = async ({ phone, password, fullName, email }) => {
  return axiosClient.post('/auth/register', {
    phone,
    password,
    fullName,
    email
  });
};
