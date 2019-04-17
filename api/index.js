import campuses from './campuses';
import users from './users';
import cars from './cars';
import categories from './categories';
import carModels from './car-models';
import carEvents from './car-events';
import userEvents from './user-events';
import pois from './pois';
import logs from './logs';
import rides from './rides';
import jwt from './jwt';
import feedback from './feedback';
import drivers from './drivers';

export default function (ctx, inject) {
  const api = {
    campuses: campuses(ctx.$axios),
    users: users(ctx.$axios),
    cars: cars(ctx.$axios),
    categories: categories(ctx.$axios),
    carModels: carModels(ctx.$axios),
    carEvents: carEvents(ctx.$axios),
    userEvents: userEvents(ctx.$axios),
    pois: pois(ctx.$axios),
    logs: logs(ctx.$axios),
    rides: rides(ctx.$axios),
    jwt: jwt(ctx.$axios),
    feedback: feedback(ctx.$axios),
    drivers: drivers(ctx.$axios),
  };
  ctx.$api = api;
  inject('api', api);
}
