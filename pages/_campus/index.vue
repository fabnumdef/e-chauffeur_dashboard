<script>
export default {
  async asyncData({ params: { campus }, redirect }) {
    return redirect(`/${campus}/dashboard`);
  },
};
</script>
