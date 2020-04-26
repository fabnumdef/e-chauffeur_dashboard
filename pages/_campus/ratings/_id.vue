<template>
  <section
    class="box"
  >
    <ul>
      <li>Note Ux : <strong>{{ uxGrade }} / 5</strong></li>
      <li>Recommandation : <strong>{{ recommandationGrade }} / 10</strong></li>
      <li v-if="message">
        Message :
      </li>
      <li v-if="message">
        {{ message }}
      </li>
      <li>Date : <strong>{{ createdAt }}</strong></li>
      <li>
        Id de la course : <strong>
          <nuxt-link :to="campusLink('rides-id', { params: { id: ride.id } })">{{ ride.id }}</nuxt-link>
        </strong>
      </li>
    </ul>
  </section>
</template>

<script>
import { DateTime } from 'luxon';
import titleMixin from '~/helpers/mixins/page-title';

const mask = 'id,uxGrade,recommandationGrade,message,createdAt,ride';

export default {
  mixins: [
    titleMixin('Appréciation'),
  ],
  async asyncData({ params, $api }) {
    const { data } = await $api.query('ratings').setMask(mask).get(params.id).setFilter('campus', params.campus);
    return {
      ...data,
      createdAt: DateTime.fromISO(data.createdAt).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
    };
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';
  a {
    color: inherit;
    text-decoration: underline;
    &:hover {
      color: $dark-gray;
    }
  }
</style>
