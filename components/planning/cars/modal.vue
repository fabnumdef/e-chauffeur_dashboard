<template>
  <client-only>
    <ec-modal
      :active="active"
      :with-background="false"
      @toggle-modal="toggleModal"
      @submit="editTimeSlot"
    >
      <template
        v-if="timeSlot.id"
        #title
      >
        Edition du slot #{{ timeSlot.id }}
      </template>
      <template
        v-else
        #title
      >
        Créer un nouveau slot
      </template>
      <ec-field label="Dates">
        <date-time
          lang="fr"
          append-to-body
          input-class="input"
          type="datetime"
          range
          :value="range"
          :minute-step="5"
          format="YYYY-MM-DD HH:mm"
          range-separator="->"
          :first-day-of-week="1"
          @input="updateDates"
        >
          <template #calendar-icon>
            <fa-icon icon="calendar" />
          </template>
        </date-time>
      </ec-field>
      <ec-field label="Voitures">
        <vue-multiselect
          v-model="timeSlot.cars"
          :options="cars.data"
          track-by="id"
          multiple
          label="label"
          :show-labels="false"
        >
          <template #option="{option}">
            {{ option.id }} {{ option.label }}
          </template>
          <template #tag="{option, search, remove}">
            <span class="multiselect__tag">
              <span>{{ option.id }} {{ option.label }}</span>
              <i
                aria-hidden="true"
                tabindex="1"
                class="multiselect__tag-icon"
                @keypress.enter.prevent="remove(option)"
                @mousedown.prevent="remove(option)"
              />
            </span>
            <span class="multiselect-tag" />
          </template>
        </vue-multiselect>
      </ec-field>
      <template v-if="timeSlot.recurrence">
        <recurring-option
          v-model="timeSlot.recurrence"
          :frequency="{weekly: 'Hebdomadaire', monthly: 'Mensuel'}"
        />
      </template>
      <ec-field label="Commentaires">
        <textarea
          id="comments"
          v-model="timeSlot.comments"
          class="textarea"
        />
      </ec-field>
      <template
        v-if="timeSlot.id"
        #submit
      >
        <button
          type="submit"
          class="button is-primary"
        >
          Modifier
        </button>
        <button
          type="button"
          class="button is-danger"
          @click="removeTimeSlot"
        >
          Supprimer
        </button>
      </template>
      <template
        v-else
        #submit
      >
        <button
          type="submit"
          class="button is-success"
        >
          Créer
        </button>
      </template>
    </ec-modal>
  </client-only>
</template>

<script>
import ecModal from '~/components/modal.vue';
import ecField from '~/components/form/field.vue';
import recurringOption from '~/components/form/recurring-option.vue';

export default {
  components: {
    ecModal,
    ecField,
    recurringOption,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    timeSlot: {
      type: Object,
      default: () => ({}),
    },
    cars: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    range() {
      return [
        this.timeSlot.start || null,
        this.timeSlot.end || null,
      ];
    },
  },
  methods: {
    toggleModal() {
      this.$emit('toggle-modal');
    },
    editTimeSlot() {
      this.$emit('edit-time-slot');
    },
    removeTimeSlot() {
      this.$emit('remove-time-slot');
    },
    updateDates([start, end]) {
      this.timeSlot.start = start;
      this.timeSlot.end = end;
    },
  },
};
</script>

<style scoped lang="scss">
  /deep/ {
    .modal-card {
      min-height: 400px;
    }
    .multiselect__content-wrapper {
      position: initial;
    }
    .multiselect__content {
      position: absolute;
    }
  }
</style>
