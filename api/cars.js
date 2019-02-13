import merge from 'lodash.merge';
import { computePagination } from './helpers';

const ENTITY = 'car';
const ENTITY_PLURAL = 'cars';

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
    async getCars() {
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

    getCar(id) {
      return axios.get(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        {
          params,
        },
      );
    },

    patchCar(id, data) {
      return axios.patch(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        merge(data, { campus }),
        {
          params,
        },
      );
    },

    postCar(data) {
      return axios.post(
        `/${ENTITY_PLURAL}`,
        merge(data, { campus }),
        {
          params,
        },
      );
    },

    deleteCar(id) {
      return axios.delete(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      );
    },
  };
};
