import { computePagination } from './helpers';

const ENTITY = 'car-model';
const ENTITY_PLURAL = 'car-models';

export default axios => ({
  async getCarModels(mask, { search = null } = {}) {
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

    response.pagination = computePagination(response)[ENTITY];

    return response;
  },

  getCarModel(id, mask) {
    return axios.get(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      {
        params: { mask },
      },
    );
  },

  patchCarModel(id, data, mask) {
    return axios.patch(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postCarModel(data, mask) {
    return axios.post(
      `/${ENTITY_PLURAL}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteCarModel(id) {
    return axios.delete(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
    );
  },
});
