import merge from 'lodash.merge';
import { computePagination } from './helpers';

const ENTITY = 'ride';
const ENTITY_PLURAL = 'rides';

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
    postRide(data) {
      return axios.post(
        `/${ENTITY_PLURAL}`,
        merge(data, { campus }),
        {
          params,
        },
      );
    },
  };
};
