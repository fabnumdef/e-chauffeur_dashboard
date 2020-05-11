<template>
  <ec-button
    v-if="!isNew"
    type="submit"
    is-primary
    :loading="loading"
    icon-left="save"
  >
    Sauvegarder
  </ec-button>
  <ec-button
    v-else-if="withoutDropdown"
    type="submit"
    is-success
    :loading="loading"
    icon-left="save"
  >
    Créer (puis modifier)
  </ec-button>
  <div
    v-else
    class="dropdown is-hoverable"
  >
    <div class="dropdown-trigger">
      <ec-button
        type="submit"
        is-success
        :loading="loading"
        icon-left="save"
        icon-right="angle-down"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        Créer (puis modifier)
      </ec-button>
    </div>
    <div
      id="dropdown-menu"
      class="dropdown-menu"
      role="menu"
    >
      <div class="dropdown-content">
        <ec-button
          is-link
          class="dropdown-item"
          v-bind="{[NEXT_ACTION_KEY]: NEXT_ACTION_NEW}"
        >
          Créer (puis commencer une nouvelle création)
        </ec-button>
        <ec-button
          is-link
          class="dropdown-item"
          v-bind="{[NEXT_ACTION_KEY]: NEXT_ACTION_LIST}"
        >
          Créer (puis retourner à la liste)
        </ec-button>
      </div>
    </div>
  </div>
</template>
<script>
/* global SubmitEvent */
export const NEXT_ACTION_KEY = 'data-next-action';
export const NEXT_ACTION_LIST = 'list';
export const NEXT_ACTION_NEW = 'new';

export const saveButtonHandler = function saveButtonHandler({ submitter = {} } = {}, {
  baseRoute = '',
  routeParams = {},
  onNew = () => {
    this.reset();
    return this.$router.push({ name: `${baseRoute}-new` });
  },
  onList = () => this.$router.push({ name: baseRoute }),
  onOther = () => this.$router.push({
    name: `${baseRoute}-id-edit`,
    params: routeParams,
  }),
} = {}) {
  if (!this) {
    throw new Error('Please use saveButtonHandler.call(this, ...params) to forward `this`');
  }
  switch (submitter.getAttribute ? submitter.getAttribute(NEXT_ACTION_KEY) : false) {
    case NEXT_ACTION_NEW:
      return onNew.call(this);
    case NEXT_ACTION_LIST:
      return onList.call(this);
    default:
      return onOther.call(this);
  }
};
export default {
  props: {
    isNew: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    withoutDropdown: {
      type: Boolean,
      default: () => typeof SubmitEvent === 'undefined',
    },
  },
  computed: {
    NEXT_ACTION_KEY: () => NEXT_ACTION_KEY,
    NEXT_ACTION_LIST: () => NEXT_ACTION_LIST,
    NEXT_ACTION_NEW: () => NEXT_ACTION_NEW,
  },
};
</script>
<style lang="scss">
  @import "~assets/css/head";
  button.dropdown-item.is-link {
    color: $text;
    &:hover {
      color: $text;
      background: invert($text);
    }
  }
</style>
