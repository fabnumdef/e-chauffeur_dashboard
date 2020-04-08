export default function ({ app }) {
  const oldError = app.$toast.error;
  // eslint-disable-next-line no-param-reassign
  app.$toast.error = function customError(messages, options = {}, ...spread) {
    const messagesArray = [].concat(messages);
    const message = messagesArray.shift();
    return oldError.call(app.$toast, message, {
      action: [
        messagesArray.length ? {
          text: '?',
          onClick: (_, { remove }) => {
            remove();
            app.$toast.error(messagesArray);
          },
        } : undefined,
        {
          text: 'Fermer',
          onClick: (_, { goAway }) => goAway(0),
        },
      ],
      ...options,
    }, ...spread);
  };
}
