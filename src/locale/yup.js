export default {
  string: {
    url: () => 'errors.url',
  },
  mixed: {
    required: () => 'errors.required',
    notOneOf: () => 'errors.duplicate',
  },
};
