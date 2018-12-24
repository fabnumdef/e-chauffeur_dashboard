import campuses from './campuses';
import users from './users';
import roles from './roles';
import cars from './cars';
import carModels from './car-models';
import carEvents from './car-events';
import userEvents from './user-events';
import pois from './pois';
import rides from './rides';
import jwt from './jwt';

export default function (ctx, inject) {
  const api = {
    campuses: campuses(ctx.$axios),
    users: users(ctx.$axios),
    roles: roles(ctx.$axios),
    cars: cars(ctx.$axios),
    carModels: carModels(ctx.$axios),
    carEvents: carEvents(ctx.$axios),
    userEvents: userEvents(ctx.$axios),
    pois: pois(ctx.$axios),
    rides: rides(ctx.$axios),
    jwt: jwt(ctx.$axios),
  };
  ctx.$api = api;
  inject('api', api);
}
