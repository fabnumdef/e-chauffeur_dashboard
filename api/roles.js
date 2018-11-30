import { computePagination } from './helpers';

const ENTITY = 'roles';

export default axios => ({
  async getRights(search) {
    return axios.get(
      '/rights',
      {
        params: { search },
      },
    );
  },

  async getRoles(mask) {
    const response = await axios.get(
      `/${ENTITY}`,
      {
        params: { mask },
        headers: {
          Range: 'role=-10',
        },
      },
    );

    response.pagination = computePagination(response).role;

    return response;
  },

  getRole(id, mask) {
    return axios.get(
      `/${ENTITY}/${id}`,
      {
        params: { mask },
      },
    );
  },

  patchRole(id, data, mask) {
    return axios.patch(
      `/${ENTITY}/${id}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postRole(data, mask) {
    return axios.post(
      `/${ENTITY}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteRole(id) {
    return axios.delete(
      `/${ENTITY}/${id}`,
    );
  },
});
