import merge from 'lodash.merge';

const ENTITY = 'logs';

export default axios => (mask) => {
  const filters = {};
  const params = {
    mask,
    filters,
  };
  return {
    async getLogs(offset = 0, limit = 30, search = null) {
      const response = await axios.get(
        `/${ENTITY}`,
        {
          params: merge(params, { search }),
          headers: {
            Range: `log=${offset}-${offset + limit - 1}`,
          },
        },
      );

      return response;
    },
  };
};
