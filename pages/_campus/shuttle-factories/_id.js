import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'shuttleFactories',
  mask: 'id,label,category,stops,comments,reachDuration',
  key: 'shuttleFactory',
  customQuery: (q, { params }) => q.setCampus(params.campus),
});
