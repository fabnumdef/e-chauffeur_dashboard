import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'users',
  mask: ['id', 'email', 'password', 'name', 'firstname', 'lastname', 'roles(role)', 'licences'],
  key: 'user',
  // @todo review
  customQuery: (query, { params }) => query.setCampus(params.campus),
});
