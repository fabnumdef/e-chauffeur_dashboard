const ENTITY_PLURAL = 'drivers';
const ENTITY_CAMPUSES = 'campuses';

export default axios => (campus, mask) => {
  return {
    async getDrivers() {
      const response = await axios.get(
        `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}`,
        {
          params: { campus, mask },
        },
      );

      return response;
    },

    async getDriver(id) {
      const response = await axios.get(
        `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        {
          params: { campus, mask },
        },
      );
      return response;
    },

    postDriver(data) {
      return axios.post(
        `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/`,
        data,
        {
          params: { campus, mask },
        },
      );
    },

    patchDriver(id, data) {
      return axios.patch(
        `/${ENTITY_CAMPUSES}/${campus}/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        data,
        {
          params: { mask },
        },
      );
    },
  };
};
