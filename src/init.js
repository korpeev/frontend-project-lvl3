import i18next from 'i18next';
import { setLocale } from 'yup';
import startApp from './app.js';
import resources from './locale/index.js';
import yupLocale from './locale/yup.js';

const init = () => {
  const i18Instance = i18next.createInstance();
  i18Instance
    .init({
      lng: 'ru',
      resources,
    })
    .then(() => {
      setLocale(yupLocale);
      startApp(i18Instance);
    });
};

export default init;
