<template>
  <ul>
    <li
      v-for="(rule, index) in rules"
      :key="index"
      class="columns"
    >
      <ec-field
        class="column"
        :is-horizontal="false"
      >
        <search-role
          v-model="rule.role"
          placeholder="Rôle"
        />
      </ec-field>
      <ec-field
        class="column"
        :is-horizontal="false"
      >
        <search-campuses
          v-model="rule.campuses"
          placeholder="Bases"
        />
      </ec-field>
      <div
        class="column is-narrow"
      >
        <button
          type="button"
          class="button is-danger is-inverted"
          @click="dropRule(index)"
        >
          <fa-icon icon="trash" />
        </button>
      </div>
    </li>
    <li>
      <button
        type="button"
        class="button is-success"
        @click="addRule"
      >
        Nouvelle règle
      </button>
    </li>
  </ul>
</template>
<script>
import searchRole from './search-role.vue';
import searchCampuses from './search-campuses.vue';
import ecField from '~/components/form/field.vue';

export default {
  components: {
    ecField,
    searchCampuses,
    searchRole,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rules: this.value || [],
    };
  },
  watch: {
    rules() {
      this.emit();
    },
  },
  methods: {
    emit() {
      this.$emit('input', this.rules);
    },
    addRule() {
      this.rules.push({});
      this.emit();
    },
    dropRule(i) {
      this.rules.splice(i, 1);
      this.emit();
    },
  },
};
</script>
<style scoped>
  .columns {
    align-items: center;
    justify-content: center;
  }
  /deep/ .control {
    margin-top: 0;
  }
</style>
