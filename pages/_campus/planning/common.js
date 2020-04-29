// Disable no-param-reassign on events
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["event"] }] */
import { DateTime } from 'luxon';
import { mapGetters } from 'vuex';


const TYPES = ['drivers', 'cars'];
export const newTimeSlot = function newTimeSlot(type) {
  const otherType = TYPES.find((t) => type !== t);
  return {
    start: null,
    end: null,
    [otherType]: null,
    [type]: [],
    recurrence: { frequency: null, enabled: false },
  };
};
export default (type) => {
  if (!type) {
    throw new Error('kind should be defined');
  }
  return {
    computed: {
      calEvents() {
        return this.events.data.map((event) => {
          const start = DateTime.fromISO(event.start);
          const end = DateTime.fromISO(event.end);
          return {
            start: this.$vuecal().getVueCalFromDatetime(start),
            end: this.$vuecal().getVueCalFromDatetime(end),
            content: {
              ...event,
              start,
              end,
            },
            class: 'slot-event',
          };
        });
      },
      ...mapGetters({
        campus: 'context/campus',
      }),
    },
    data() {
      return {
        isModalOpen: false,
        isGrabbing: false,
      };
    },
    methods: {
      toggleModal(val) {
        this.isModalOpen = typeof val !== 'undefined' ? val : this.modalOpen;
      },

      dragstart(event, data) {
        this.isGrabbing = true;
        event.dataTransfer.setData('application/json', JSON.stringify(data));
        event.currentTarget.style.backgroundColor = 'rgba(0, 83, 179, 0.4)';
        event.currentTarget.style.cursor = 'grabbing';
      },

      dragend(event) {
        this.isGrabbing = false;
        event.currentTarget.style.cursor = 'grab';
        event.currentTarget.style.backgroundColor = '';
      },

      updateDates([start, end]) {
        Object.assign(this.timeSlot, { start, end });
      },

      openEdit({ content: timeSlot }) {
        this.timeSlot = timeSlot;
        this.toggleModal(true);
      },

      openCreate({
        start = DateTime.fromJSDate(new Date()).startOf('hour').toJSDate(),
        end = DateTime.fromJSDate(new Date()).endOf('hour').toJSDate(),
      }) {
        this.timeSlot = Object.assign(
          newTimeSlot(type),
          { start, end },
        );
        this.toggleModal(true);
      },
    },
  };
};
