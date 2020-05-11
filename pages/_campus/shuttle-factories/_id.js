import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'shuttleFactories',
  mask: 'id,label,category,stops(id,label,location(coordinates)),comments,reachDuration',
  key: 'shuttleFactory',
  customGet: async (query, { params }) => query.setFilter('campus', params.campus),
});
