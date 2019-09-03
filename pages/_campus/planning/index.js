export default {
  asyncData({ redirect, params }) {
    return redirect({ name: 'campus-planning-drivers', params });
  },
};
