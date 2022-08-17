import axios from 'axios';

export const getPlaces = async (options) => {
  return axios.get(`http://api.positionstack.com/v1/forward`, {
    params: {
      access_key: '9e5f5d2ecb1b1055bcda9086c054de17',
      ...options
    }
  });
};
