<template>
  <div>
    <nuxt-child :campus="campus" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = 'id,name,location,phone(drivers,everybody),categories(id,label)';

export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.hasRight('canGetCampus')) {
      throw new Error('Vous d\'avez pas les droits pour récupérer les informations d\'une base.');
    }
    return {
      campus: Object.assign(
        { phone: {}, categories: [] },
        (await $api.campuses.getCampus(params.id, EDITABLE_FIELDS)).data,
      ),
    };
  },
};
</script>
