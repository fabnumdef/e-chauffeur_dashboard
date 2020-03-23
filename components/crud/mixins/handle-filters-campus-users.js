export default {
  data() {
    return {
      usersFilter: {
        fieldFilter: null,
        contentFilter: null,
      },
      driversFilter: {
        fieldFilter: null,
        contentFilter: null,
      },
    };
  },
  computed: {
    fieldContentUser() {
      return this.usersFilter.fieldFilter ? this.usersData.reduce((acc, data) => {
        if (!acc.find((d) => d === data[this.usersFilter.fieldFilter.id])) {
          acc.push(data[this.usersFilter.fieldFilter.id]);
        }
        return acc;
      }, []) : [];
    },
    filteredDataUser() {
      return this.usersFilter.contentFilter
        ? this.usersData.filter((user) => user[this.usersFilter.fieldFilter.id] === this.usersFilter.contentFilter)
        : this.usersData;
    },
    fieldContentDriver() {
      return this.driversFilter.fieldFilter ? this.driversData.reduce((acc, data) => {
        if (!acc.find((d) => d === data[this.driversFilter.fieldFilter.id])) {
          acc.push(data[this.driversFilter.fieldFilter.id]);
        }
        return acc;
      }, []) : [];
    },
    filteredDataDriver() {
      return this.driversFilter.contentFilter
        ? this.driversData.filter(
          (user) => user[this.driversFilter.fieldFilter.id] === this.driversFilter.contentFilter,
        )
        : this.driversData;
    },
  },
  methods: {
    updateFieldFilterUser(data) {
      this.usersFilter.fieldFilter = data;
    },
    updateContentFilterUser(data) {
      this.usersFilter.contentFilter = data;
    },
    updateFieldFilterDriver(data) {
      this.driversFilter.fieldFilter = data;
    },
    updateContentFilterDriver(data) {
      this.driversFilter.contentFilter = data;
    },
    resetUsers() {
      this.usersFilter.fieldFilter = null;
      this.usersFilter.contentFilter = null;
    },
    resetDrivers() {
      this.driversFilter.fieldFilter = null;
      this.driversFilter.contentFilter = null;
    },
  },
};
