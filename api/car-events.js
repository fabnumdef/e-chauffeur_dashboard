import merge from 'lodash.merge';
import { computePagination } from './helpers';

const ENTITY = 'car-event';
const ENTITY_PLURAL = 'car-events';

export default axios => (car, mask = ',') => {
  const filters = {};
  if (car) {
    filters.car = car.id;
  }
  const params = {
    mask,
    filters,
  };
  return {
    async getCarEvents() {
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

    getCarEvent(id) {
      return axios.get(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        {
          params,
        },
      );
    },

    patchCarEvent(id, data) {
      return axios.patch(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        merge(data, { car }),
        {
          params,
        },
      );
    },

    postCarEvent(data) {
      return axios.post(
        `/${ENTITY_PLURAL}`,
        merge(data, { car }),
        {
          params,
        },
      );
    },

    deleteCarEvent(id) {
      return axios.delete(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
      );
    },
  };
};
