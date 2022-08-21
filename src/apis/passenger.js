import { axiosClient } from './axiosClient';

export const getPassengerById = async ({ id }) => {
  return axiosClient.get(`/passengers/${id}`);
};

export const pushNotificationPassenger = async (data) => {
  return axiosClient.post(`/passengers/push-notification`, data);
};
