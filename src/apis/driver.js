import { axiosClient } from './axiosClient';

export const getDriverByPhone = async ({ phone }) => {
  return axiosClient.get(`/drivers/phone/${phone}`);
};

export const updateFCMToken = async ({ id, token }) => {
  return axiosClient.put(`/drivers/${id}`, { FCM_token: token });
};

export const acceptBooking = async ({ driverId, bookingId }) => {
  return axiosClient.put(`/drivers/accept`, { driverId, bookingId });
};

export const doneBooking = async ({ bookingId }) => {
  return axiosClient.put(`/drivers/done`, { bookingId });
};

export const cancelBooking = async ({ bookingId, driverId }) => {
  return axiosClient.put(`/drivers/cancel`, { bookingId, driverId });
};
