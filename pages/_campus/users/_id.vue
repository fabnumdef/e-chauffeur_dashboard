<template>
  <div>
    <nuxt-child :user="user" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'email', 'password', 'name', 'firstname', 'lastname', 'roles(role)', 'licences'];

export default {
  async asyncData({ params, $api }) {
    return {
      user: (await $api.campusUsers(params.campus, EDITABLE_FIELDS.join(',')).getUser(params.id)).data,
    };
  },
};
</script>
