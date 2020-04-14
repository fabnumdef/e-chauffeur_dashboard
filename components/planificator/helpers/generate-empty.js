import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

export const generateEmptyRide = () => ({
  start: null,
  end: null,
  phone: null,
  departure: null,
  arrival: null,
  driver: null,
  status: CREATED,
  category: null,
  passengersCount: 1,
  luggage: false,
  comments: '',
});

export const generateEmptyShuttle = () => ({
  start: null,
  end: null,
  phone: null,
  driver: null,
  status: CREATED,
  stops: [],
  category: null,
  passengers: [],
  comments: '',
  pattern: {
    id: null,
    label: null,
    stops: [],
  },
});
