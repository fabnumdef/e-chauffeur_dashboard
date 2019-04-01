import merge from 'lodash.merge';
import { computePagination } from './helpers';

const ENTITY = 'pois';

export default axios => (campus, mask) => {
  const filters = {};
  if (campus) {
    filters.campus = campus.id;
  }
  const params = {
    mask,
    filters,
  };
  return {
    async getPois(offset = 0, limit = 30, search = null) {
      const response = await axios.get(
        `/${ENTITY}`,
        {
          params: merge(params, { search }),
          headers: {
            Range: `poi=${offset}-${offset + limit - 1}`,
          },
        },
      );

      response.pagination = computePagination(response).poi;

      return response;
    },

    getPoi(id) {
      return axios.get(
        `/${ENTITY}/${encodeURIComponent(id)}`,
        {
          params,
        },
      );
    },

    patchPoi(id, data) {
      return axios.patch(
        `/${ENTITY}/${encodeURIComponent(id)}`,
        merge(data, { campus }),
        {
          params,
        },
      );
    },

    postPoi(data) {
      return axios.post(
        `/${ENTITY}`,
        merge(data, { campus }),
        {
          params,
        },
      );
    },

    deletePoi(id) {
      return axios.delete(
        `/${ENTITY}/${encodeURIComponent(id)}`,
      );
    },
  };
};
