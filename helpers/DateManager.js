import { DateTime } from 'luxon';

export default class {
  static formatDate(format, date = DateTime.local().toString()) {
    return DateTime.fromISO(date).toFormat(format);
  }
}
