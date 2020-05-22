import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'cars',
  mask: 'id,label,model',
  key: 'car',
  customQuery: (q, { params }) => q.setCampus(params.campus),
});
