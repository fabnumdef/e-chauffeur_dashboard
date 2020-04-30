import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({ query: 'carModels', mask: 'id,label,capacity', key: 'carModel' });
