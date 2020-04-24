export default () => ({
  data() {
    return {
      errors: {},
    };
  },
  methods: {
    resetErrors() {
      this.setErrors();
    },
    setErrors(errors = {}) {
      this.errors = errors;
    },
    hasError(path) {
      return !!this.errors[path];
    },
    getErrorMessage(path) {
      if (!this.errors[path]) {
        return undefined;
      }
      return this.errors[path].message;
    },
    getErrorClass(path) {
      return {
        'is-danger': this.hasError(path),
      };
    },
    async handleCommonErrorsBehavior(callback, ...customMessages) {
      this.setErrors();
      try {
        await callback();
      } catch ({ message: errorMessage, response: { status, data: { errors, message } = {} } = {} }) {
        this.setErrors(errors);
        this.$toast.error([
          ...customMessages,
          [`Erreur ${status || ''}`, message || errorMessage].join(' : '),
          ...Array.isArray(errors) ? errors : Object.values(errors || {}).map((e) => e.message),
        ]);
      }
    },
  },
});
