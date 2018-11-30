import { computePagination } from './helpers';

const ENTITY = 'car';
const ENTITY_PLURAL = 'cars';

export default axios => ({
  async getCars(mask) {
    const response = await axios.get(
      `/${ENTITY_PLURAL}`,
      {
        params: { mask },
        headers: {
          Range: `${ENTITY}=-10`,
        },
      },
    );

    response.pagination = computePagination(response)[ENTITY];

    return response;
  },

  getCar(id, mask) {
    return axios.get(
      `/${ENTITY_PLURAL}/${id}`,
      {
        params: { mask },
      },
    );
  },

  patchCar(id, data, mask) {
    return axios.patch(
      `/${ENTITY_PLURAL}/${id}`,
      data,
      {
        params: { mask },
      },
    );
  },

  postCar(data, mask) {
    return axios.post(
      `/${ENTITY_PLURAL}`,
      data,
      {
        params: { mask },
      },
    );
  },

  deleteCar(id) {
    return axios.delete(
      `/${ENTITY_PLURAL}/${id}`,
    );
  },
});
