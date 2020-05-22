import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'phones',
  mask: 'id,imei,number,model,owner,campus,state,comments',
  key: 'phone',
  customQuery: (q, { params }) => q.setCampus(params.campus),
});
