import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'drivers',
  mask: ['id', 'email', 'password', 'name', 'firstname', 'lastname', 'licences'],
  key: 'driver',
  // @todo review
  customQuery: (query, { params }) => query.setCampus(params.campus),
});
