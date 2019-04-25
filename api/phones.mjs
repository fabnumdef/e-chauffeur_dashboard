import { computePagination } from './helpers';

const ENTITY = 'phones';

export default axios => ({
  async getPhones(mask) {
    const response = await axios.get(
      `/${ENTITY}`,
      {
        params: { mask },
        headers: {
          Range: 'phone=-10',
        },
      },
    );

    response.pagination = computePagination(response).phone;

    return response;
  },

  async getPhone(id, mask) {
    const response = await axios.get(
      `/${ENTITY}/${encodeURIComponent(id)}`,
      {
        params: { mask },
      },
    );

    return response;
  },

  postPhone(data, mask) {
    return axios.post(
      `/${ENTITY}`,
      data,
      {
        params: { mask },
      },
    );
  },

  patchPhone(id, data, mask) {
    return axios.patch(
      `/${ENTITY}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deletePhone(id) {
    return axios.delete(
      `/${ENTITY}/${encodeURIComponent(id)}`,
    );
  },
});
