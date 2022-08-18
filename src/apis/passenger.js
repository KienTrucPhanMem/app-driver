import { axiosClient } from './axiosClient';

export const getPassengerById = async ({ id }) => {
  return axiosClient.get(`/passengers/${id}`);
};
