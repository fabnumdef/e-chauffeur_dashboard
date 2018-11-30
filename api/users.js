import { computePagination } from './helpers';

const ENTITY = 'users';

export default axios => ({
  async getUsers(mask) {
    const response = await axios.get(
      `/${ENTITY}`,
      {
        params: { mask },
        headers: {
          Range: 'user=-10',
        },
      },
    );

    response.pagination = computePagination(response).user;

    return response;
  },

  getUser(id, mask) {
    return axios.get(
      `/${ENTITY}/${id}`,
      {
        params: { mask },
      },
    );
  },

  patchUser(id, data, mask) {
    return axios.patch(
      `/${ENTITY}/${id}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postUser(data, mask) {
    return axios.post(
      `/${ENTITY}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteUser(id) {
    return axios.delete(
      `/${ENTITY}/${id}`,
    );
  },
});
