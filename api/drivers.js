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
  };
};
