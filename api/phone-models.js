import { computePagination } from './helpers';

const ENTITY = 'phone-model';
const ENTITY_PLURAL = 'phone-models';

export default axios => ({
  async getPhoneModels(mask, { search = null } = {}) {
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

  getPhoneModel(id, mask) {
    return axios.get(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      {
        params: { mask },
      },
    );
  },

  patchPhoneModel(id, data, mask) {
    return axios.patch(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postPhoneModel(data, mask) {
    return axios.post(
      `/${ENTITY_PLURAL}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deletePhoneModel(id) {
    return axios.delete(
      `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
    );
  },
});
