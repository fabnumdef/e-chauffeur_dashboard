import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'pois',
  mask: 'id,label,location(coordinates),campus,enabled',
  key: 'poi',
  customGet: async (query, { params }) => query.setFilter('campus', params.campus),
});
