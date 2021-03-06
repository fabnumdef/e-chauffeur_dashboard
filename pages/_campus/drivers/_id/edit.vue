<template>
  <form
    class="box"
    @submit.prevent="edit(data, $event)"
  >
    <div class="columns">
      <div class="column">
        <ec-field
          label="Prénom"
          autocomplete="off"
          field-id="firstname"
          :error-message="getErrorMessage('firstname')"
        >
          <input
            id="firstname"
            v-model.trim="data.firstname"
            class="input"
            :class="getErrorClass('firstname')"
          >
        </ec-field>
      </div>
      <div class="column">
        <ec-field
          label="Nom de famille"
          field-id="lastname"
          :error-message="getErrorMessage('lastname')"
        >
          <input
            id="lastname"
            v-model.trim="data.lastname"
            autocomplete="off"
            class="input"
            :class="getErrorClass('lastname')"
          >
        </ec-field>
      </div>
    </div>
    <ec-field
      label="Email"
      field-id="email"
      :error-message="getErrorMessage('email')"
    >
      <input
        id="email"
        v-model.trim="data.email"
        autocomplete="off"
        type="text"
        class="input"
        :class="getErrorClass('email')"
      >
    </ec-field>
    <ec-field
      label="Mot de passe"
      field-id="password"
      :error-message="getErrorMessage('password')"
    >
      <ec-password
        id="password"
        v-model="data.password"
        :class="getErrorClass('password')"
      />
    </ec-field>
    <ec-field
      label="Permis"
      field-id="licences"
      :error-message="getErrorMessage('licences')"
    >
      <vue-multiselect
        v-model="licences"
        multiple
        :options="['B', 'C', 'D', 'E']"
        placeholder="Renseignez la liste des permis"
      />
    </ec-field>
    <save-button
      :loading="loading"
      :is-new="!id"
      has-alt
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import ecPassword from '~/components/form/password.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';

export default {
  components: {
    ecPassword,

    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Chauffeur', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          ...this.driver,
        },
      };
    }),
  ],
  props: {
    driver: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { id } = this.driver;
    this.setTitle(id ? `Chauffeur #${id}` : 'Chauffeur', id ? 'Édition' : 'Création');
    return {
      id,
      licences: this.driver.licences || ['B'],
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(driver, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiDrivers = this.$api.query('drivers')
          .setMask('id,email,firstname,lastname,licences')
          .setCampus(this.campus.id);
        const formattedDriver = {
          ...driver,
          licences: this.licences,
          campus: this.campus,
        };
        let data = {};
        if (this.id) {
          ({ data } = (await ApiDrivers.edit(driver.id, formattedDriver)));
        } else {
          ({ data } = (await ApiDrivers.create(formattedDriver)));
        }
        this.$toast.success('Chauffeur enregistré avec succès');
        return saveButtonHandler.call(this, event, {
          onNew: () => {
            this.reset();
            return this.$router.push(this.campusLink('drivers-new'));
          },
          onList: () => this.$router.push(this.campusLink('drivers')),
          onOther: () => this.$router.push(this.campusLink('drivers-id-edit', {
            params: data,
          })),
        });
      }));
    },
  },
};
</script>
