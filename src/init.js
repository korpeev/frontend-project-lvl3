import i18next from 'i18next';
import { setLocale } from 'yup';
import app from './app.js';
import resources from './locale/index.js';
import yupLocale from './locale/yup.js';

const init = async () => {
  const i18Instance = i18next.createInstance();
  try {
    await i18Instance.init({ lng: 'ru', debug: true, resources });
    setLocale(yupLocale);
    app(i18Instance);
  } catch (error) {
    console.log(error);
  }
};

export default init;
