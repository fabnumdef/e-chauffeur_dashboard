import { computePagination } from './helpers';

const ENTITY_PLURAL = 'drivers';
const ENTITY_CAMPUSES = 'campuses';

export default axios => (campus, mask) => ({
  async getDrivers() {
    const response = await axios.get(
      `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}`,
      {
        params: { campus, mask },
        headers: {
          Range: 'user=-10',
        },
      },
    );

    response.pagination = computePagination(response).user;

    return response;
  },

  async getDriver(id) {
    const response = await axios.get(
      `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      {
        params: { campus, mask },
      },
    );
    return response;
  },

  postDriver(data) {
    return axios.post(
      `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/`,
      data,
      {
        params: { campus, mask },
      },
    );
  },

  patchDriver(id, data) {
    return axios.patch(
      `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteDriver(id) {
    return axios.delete(
      `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
    );
  },
});
