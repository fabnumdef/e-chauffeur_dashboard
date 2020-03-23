<template>
  <div id="crud-filter">
    <vue-multiselect
      :options="fieldsHeader"
      placeholder="Sélectionner le champ par lequel filtrer"
      :value="fieldValue"
      track-by="id"
      label="label"
      :show-labels="false"
      :searchable="false"
      @input="updateFieldFilter"
    />
    <vue-multiselect
      v-if="fieldContent.length > 0"
      :options="formattedFieldContent"
      placeholder="Rechercher dans le champ sélectionné"
      searchable
      :value="contentValue"
      :show-labels="false"
      @input="updateContentFilter"
    />
    <button
      v-if="fieldContent.length > 0"
      class="button is-dark"
      @click="resetFilter"
    >
      Supprimer les filtres
    </button>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    fieldValue: {
      type: Object,
      default: () => null,
    },
    fieldsHeader: {
      type: Array,
      default: () => [],
    },
    contentValue: {
      type: String,
      default: '',
    },
    fieldContent: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formattedFieldContent() {
      return this.fieldContent.map((data) => {
        if (this.fieldValue.id === 'enabled') {
          return data === 'fas:check-circle:success' ? 'Activé' : 'Désactivé';
        }
        return data;
      });
    },
  },
  methods: {
    updateFieldFilter(d) {
      let data;
      if (d) {
        [data] = this.fieldsHeader.filter(({ id }) => id === d.id);
      }
      this.$emit('updateFieldFilter', data || null);
    },
    updateContentFilter(d) {
      let data = d;
      if (this.fieldValue.id === 'enabled') {
        data = data === 'Activé' ? 'fas:check-circle:success' : 'fas:times-circle:error';
      }
      this.$emit('updateContentFilter', data);
    },
    resetFilter() {
      this.$emit('reset');
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';

  #crud-filter {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    .multiselect {
      width: 30%;
      margin-right: 1em;
      color: $white;
      /deep/ li {
        color: $black;
      }
      /deep/ .multiselect__input {
        background-color: inherit;
        color: inherit;
      }
    }
    .button {
      font-weight: 700;
    }
  }
</style>
