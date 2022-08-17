import { axiosClient } from './axiosClient';

export const getDriverByPhone = async ({ phone }) => {
  return axiosClient.get(`/drivers/phone/${phone}`);
};

export const updateFCMToken = async ({ id, token }) => {
  return axiosClient.put(`/drivers/${id}`, { token });
};
