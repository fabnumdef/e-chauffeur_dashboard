import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({ query: 'users', mask: 'id,firstname,lastname,name,email,roles(role,campuses(id,name)),gprd', key: 'user' });
