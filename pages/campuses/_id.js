import abstractRoute from '~/helpers/abstracts/_id';

export default abstractRoute({
  query: 'campuses',
  mask: ['id,name,location,phone(drivers,everybody)',
    'categories(id,label),information,workedDays,timezone,workedHours',
    'defaultRideDuration,defaultReservationScope',
  ],
  key: 'campus',
});
