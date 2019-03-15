export default axios => ({
  async postFeedback(message, type) {
    return axios.post(
      '/feedback',
      {
        message,
        type,
      },
    );
  },
});
