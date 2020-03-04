<template>
  <main>
    <header>
      <h1
        class="title"
      >
        Appréciation <em class="is-size-6">#{{ id }}</em>
      </h1>
    </header>
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
        <li v-if="ride && ride.id">
          Id de la course : <strong>
            <nuxt-link :to="campusLink('rides-id', { params: { id: ride.id } })">{{ ride.id }}</nuxt-link>
          </strong>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { DateTime } from 'luxon';

const mask = 'id,uxGrade,recommandationGrade,message,createdAt,ride';

export default {
  async asyncData({ params, $api }) {
    const { data } = await $api.ratings(params.campus, mask).getRating(params.id);
    const rating = {
      ...data,
      createdAt: DateTime.fromISO(data.createdAt).toFormat('dd LLL yyyy à HH:mm', { locale: 'fr' }),
    };
    return { ...rating };
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';
  h1 {
    margin-bottom: .6em;
  }
  a {
    color: inherit;
    text-decoration: underline;
    &:hover {
      color: $dark-gray;
    }
  }
</style>
