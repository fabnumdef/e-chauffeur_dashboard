<template>
  <main>
    <h1 class="title">
      Tableau de bord
    </h1>
    <bulma-tile ancestor>
      <bulma-tile parent>
        <bulma-tile class="box">
          <header class="title">
            Total de courses
          </header>
          <div class="content is-large">
            <strong>{{ stats.total }}</strong> course(s)
          </div>
        </bulma-tile>
      </bulma-tile>
    </bulma-tile>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import bulmaTile from '~/components/tile.vue';

export default {
  components: {
    bulmaTile,
  },
  async asyncData({ $api, params }) {
    const start = DateTime.local().startOf('weeks').toJSDate();
    const end = DateTime.local().endOf('weeks').toJSDate();
    const { data: stats } = await $api.rides(params.campus).getStats('total', start, end);
    return {
      stats,
    };
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  $box-padding: 1.25rem !default

  /deep/ .box {
    .title {
      background: $light-gray;
      padding: $box-padding;
      color: findColorInvert($light-gray);
      font-size: $size-large;
      margin: -$box-padding;
    }
    .content {
      margin-top: $box-padding * 2;
    }
  }
</style>
