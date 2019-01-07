import { computePagination } from './helpers';

const ENTITY = 'campus';
export const ENTITY_PLURAL = 'campuses';

export default axios => ({
  async getCampuses(mask, { search = null } = {}) {
    const response = await axios.get(
      `/${ENTITY_PLURAL}`,
      {
        params: { mask, search },
        headers: {
          Range: `${ENTITY}=-10`,
        },
      },
    );

    response.pagination = computePagination(response)[ENTITY];

    return response;
  },

  getCampus(id, mask) {
    return axios.get(
      `/${ENTITY_PLURAL}/${id}`,
      {
        params: { mask },
      },
    );
  },

  patchCampus(id, data, mask) {
    return axios.patch(
      `/${ENTITY_PLURAL}/${id}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postCampus(data, mask) {
    return axios.post(
      `/${ENTITY_PLURAL}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteCampus(id) {
    return axios.delete(
      `/${ENTITY_PLURAL}/${id}`,
    );
  },
});
