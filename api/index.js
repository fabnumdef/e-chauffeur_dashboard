import campuses from './campuses';
import users from './users';
import roles from './roles';
import cars from './cars';
import pois from './pois';

export default function (ctx, inject) {
  const api = {
    campuses: campuses(ctx.$axios),
    users: users(ctx.$axios),
    roles: roles(ctx.$axios),
    cars: cars(ctx.$axios),
    pois: pois(ctx.$axios),
  };
  ctx.$api = api;
  inject('api', api);
}
