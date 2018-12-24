import merge from 'lodash.merge';
import { computePagination } from './helpers';

const ENTITY = 'user-event';
const ENTITY_PLURAL = 'user-events';

export default axios => (user, mask = ',') => {
  const filters = {};
  if (user) {
    filters.user = user.id;
  }
  const params = {
    mask,
    filters,
  };
  return {
    async getUserEvents() {
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

    getUserEvent(id) {
      return axios.get(
        `/${ENTITY_PLURAL}/${id}`,
        {
          params,
        },
      );
    },

    patchUserEvent(id, data) {
      return axios.patch(
        `/${ENTITY_PLURAL}/${id}`,
        merge(data, { user }),
        {
          params,
        },
      );
    },

    postUserEvent(data) {
      return axios.post(
        `/${ENTITY_PLURAL}`,
        merge(data, { user }),
        {
          params,
        },
      );
    },

    deleteUserEvent(id) {
      return axios.delete(
        `/${ENTITY_PLURAL}/${id}`,
      );
    },
  };
};
