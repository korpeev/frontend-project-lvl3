import i18next from 'i18next';

export default {
  string: {
    url: () => i18next.t('errors.url'),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'duplicate' }),
  },
};
