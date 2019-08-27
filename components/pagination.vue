<template>
  <nav
    class="pagination is-right"
    role="navigation"
    aria-label="pagination"
  >
    <div>
      {{ total }} results
    </div>
    <ul
      v-if="visiblesPages.length > 1"
      class="pagination-list"
    >
      <li
        v-for="(p, i) in visiblesPages"
        :key="i"
      >
        <span
          v-if="p === null"
          class="pagination-ellipsis"
        >
          …
        </span>
        <nuxt-link
          v-else
          :to="`?offset=${(p - 1) * perPage}`"
          :class="{'is-current': currentPage === p}"
          :aria-label="`Goto page ${p}`"
          :aria-current="currentPage === p ? 'page' : false"
          class="pagination-link"
        >
          {{ p }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import range from 'lodash.range';

export default {
  props: {
    perPage: {
      type: Number,
      default: 100,
    },
    total: {
      type: Number,
      default: null,
    },
    numberLinks: {
      type: Number,
      default: 5,
    },
    offset: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    currentPage() {
      return Math.floor(this.offset / this.perPage) + 1;
    },
    numberOfPages() {
      return Math.floor(this.total / (this.perPage)) + (this.total % this.perPage === 0 ? 0 : 1);
    },
    visiblesPages() {
      const extraPages = (this.numberLinks - 3);
      const pages = range(
        this.currentPage - Math.floor(extraPages / 2),
        this.currentPage + Math.floor(extraPages / 2) + 1,
      )
        .filter((p) => p > 0 && p < (this.numberOfPages));

      if (pages[0] && pages[0] > 1) {
        pages.unshift(1);
      }

      if (pages[pages.length - 1] && pages[pages.length - 1] <= this.numberOfPages + 1) {
        pages.push(this.numberOfPages);
      }

      return pages.reduce(
        // @todo: expand this sequence to remove eslint disabling
        // eslint-disable-next-line no-sequences
        (result, v, i, arr) => (result.push(v), (v < arr[i + 1] - 1 ? result.push(null) : false), result),
        [],
      );
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";

  .pagination-link.is-current {
    background-color: $primary;
  }
</style>
