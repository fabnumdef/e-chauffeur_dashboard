import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'cars',
  mask: 'id,label,model',
  key: 'car',
  // @todo review
  customGet: (query, { params }) => query.setFilter('campus', params.campus),
});
