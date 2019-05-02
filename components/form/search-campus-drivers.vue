<template>
  <div class="columns">
    <ec-field
      class="column is-size-7"
      label="Choix de la base"
    >
      <ec-search-user-campus
        v-model="campus"
        @input="onCampusInput"
      />
    </ec-field>
    <ec-field
      class="column is-size-7"
      label="Choix du chauffeur"
    >
      <vue-multiselect
        :id="id"
        v-model="driver"
        :options="drivers"
        track-by="id"
        label="name"
        :loading="loading"
        :searchable="false"
        :show-labels="false"
        :placeholder="placeholder"
        @input="onDriverInput"
      />
    </ec-field>
  </div>
</template>

<script>
import ecField from '~/components/form/field.vue';
import ecSearchUserCampus from '~/components/form/search-user-campus.vue';

export default {
  components: {
    ecField,
    ecSearchUserCampus,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: 'Choisir un chauffeur',
    },
  },
  data() {
    return {
      drivers: [],
      driver: {},
      campus: {},
      returnData: {},
      loading: false,
    };
  },

  async mounted() {
    if (this.value.id) {
      this.campus = this.value.campus;
      this.drivers = await this.getCampusDrivers(this.value.campus.id);
      this.driver = {
        id: this.value.id,
        name: this.value.name,
      };
    }
  },

  methods: {
    async onCampusInput(campus) {
      if (campus) {
        this.driver = {};
        this.campus = {
          id: campus.id,
          name: campus.name,
        };
        this.drivers = await this.getCampusDrivers(campus.id);
      } else {
        this.drivers = [];
        this.driver = {};
        this.campus = {};
        this.returnData = {};
        this.$emit('input', this.returnData);
      }
    },

    onDriverInput(driver) {
      if (driver) {
        Object.assign(this.returnData, {
          campus: {
            _id: this.campus.id,
            name: this.campus.name,
          },
          _id: driver.id,
          name: driver.name,
          email: driver.email,
        });
      } else {
        this.driver = {};
        delete this.returnData._id;
        delete this.returnData.name;
        delete this.returnData.email;
      }
      this.$emit('input', this.returnData);
    },

    async getCampusDrivers(campus) {
      this.loading = true;
      const { data } = await this.$api.drivers(campus, 'id,name,email').getDrivers();
      this.loading = false;
      return data;
    },
  },
};
</script>
