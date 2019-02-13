import { computePagination } from './helpers';

const ENTITY = 'pois';

export default axios => ({
  async getPois(mask, { search = null } = {}) {
    const response = await axios.get(
      `/${ENTITY}`,
      {
        params: { mask, search },
        headers: {
          Range: 'poi=-10',
        },
      },
    );

    response.pagination = computePagination(response).poi;

    return response;
  },

  getPoi(id, mask) {
    return axios.get(
      `/${ENTITY}/${encodeURIComponent(id)}`,
      {
        params: { mask },
      },
    );
  },

  patchPoi(id, data, mask) {
    return axios.patch(
      `/${ENTITY}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postPoi(data, mask) {
    return axios.post(
      `/${ENTITY}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deletePoi(id) {
    return axios.delete(
      `/${ENTITY}/${encodeURIComponent(id)}`,
    );
  },
});
