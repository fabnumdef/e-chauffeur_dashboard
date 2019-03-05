import { Interval, DateTime } from 'luxon';
import merge from 'lodash.merge';
import { ENTITY_PLURAL as CAMPUS_PLURAL } from './campuses';
import { computePagination } from './helpers';

const ENTITY_PLURAL = 'rides';
const ENTITY = 'ride';

export default axios => (campus, mask) => {
  const filters = {};
  if (campus) {
    filters.campus = campus;
  }
  const params = {
    mask,
    filters,
  };
  return {
    async getRides(start, end) {
      const response = await axios.get(
        `/${ENTITY_PLURAL}`,
        {
          params: {
            mask,
            filters: merge({}, filters, { start, end }),
          },
          headers: {
            Range: `${ENTITY}=-10`,
          },
        },
      );

      response.pagination = computePagination(response)[ENTITY];

      return response;
    },

    async getExportRides(start, end) {
      const response = await axios.get(
        `/${ENTITY_PLURAL}/export`,
        {
          params: {
            mask,
            filters: merge({}, filters, { start, end }),
          },
        },
      );

      return response;
    },

    async postRide(data) {
      return axios.post(
        `/${ENTITY_PLURAL}`,
        merge(data, { campus: { id: campus } }),
        {
          params,
        },
      );
    },

    async patchRide(id, data) {
      return axios.patch(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}`,
        data,
        {
          params,
        },
      );
    },

    async getAvailableDrivers(userMask, start, end) {
      const response = await axios.get(
        `/${CAMPUS_PLURAL}/${campus}/drivers`,
        {
          params: {
            mask: userMask,
            filters: {
              start,
              end,
            },
          },
        },
      );
      response.data = response.data.map((u) => {
        const user = u;
        if (u.availabilities) {
          user.availabilities = u.availabilities
            .filter(r => r.s && r.e)
            .map(a => Interval.fromDateTimes(DateTime.fromISO(a.s), DateTime.fromISO(a.e)));
        }
        return user;
      });
      return response;
    },

    async getDriversPositions(userMask) {
      const response = await axios.get(
        `/${CAMPUS_PLURAL}/${campus}/drivers-positions`,
        {
          params: {
            mask: userMask,
          },
        },
      );
      response.data = response.data.map((u) => {
        const user = u;
        if (u.availabilities) {
          user.availabilities = u.availabilities
            .filter(r => r.s && r.e)
            .map(a => Interval.fromDateTimes(DateTime.fromISO(a.s), DateTime.fromISO(a.e)));
        }
        return user;
      });
      return response;
    },

    async getAvailableCars(carMask, start, end) {
      const response = await axios.get(
        `/${CAMPUS_PLURAL}/${campus}/cars`,
        {
          params: {
            mask: carMask,
            filters: {
              start,
              end,
            },
          },
        },
      );
      response.data = response.data.map((c) => {
        const car = c;
        if (c.availabilities) {
          car.availabilities = c.availabilities
            .filter(r => r.s && r.e)
            .map(a => Interval.fromDateTimes(DateTime.fromISO(a.s), DateTime.fromISO(a.e)));
        }
        return car;
      });
      return response;
    },

    async getStats(queriedStats, start, end) {
      return axios.get(
        `/${CAMPUS_PLURAL}/${campus}/stats`,
        {
          params: {
            mask: queriedStats,
            filters: {
              start,
              end,
            },
          },
        },
      );
    },

    async mutateRide({ id }, action) {
      return axios.post(
        `/${ENTITY_PLURAL}/${encodeURIComponent(id)}/${action}`,
        {},
        {
          params,
        },
      );
    },
  };
};
