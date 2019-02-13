import { computePagination } from './helpers';

const ENTITY = 'role';
const ENTITY_PLURAL = 'roles';

export default axios => ({
  async getRights(search) {
    return axios.get(
      '/rights',
      {
        params: { search },
      },
    );
  },

  async getRoles(mask, { search = null } = {}) {
    const params = { mask };

    if (search) {
      params.search = search;
    }

    const response = await axios.get(
      `/${ENTITY_PLURAL}`,
      {
        params,
        headers: {
          Range: `${ENTITY}=-10`,
        },
      },
    );

    response.pagination = computePagination(response).role;

    return response;
  },

  getRole(id, mask) {
    return axios.get(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      {
        params: { mask },
      },
    );
  },

  patchRole(id, data, mask) {
    return axios.patch(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postRole(data, mask) {
    return axios.post(
      `/${ENTITY_PLURAL}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteRole(id) {
    return axios.delete(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
    );
  },
});
