import axios from 'axios';
import * as yup from 'yup';
import getWatchedState from './watchedState';
import hooks from './hooks';

const startApp = (i18Instance) => {
  const defaultState = {
    input: '',
    feeds: [],
    posts: [],
    error: '',
    form: {
      status: 'initial',
    },
  };
  const { setErrorText, setInputValue } = hooks(defaultState);
  const route = {
    api: (targetUrl) => {
      const proxyUrl = new URL(
        '/get',
        'https://hexlet-allorigins.herokuapp.com'
      );
      proxyUrl.searchParams.set('url', targetUrl);
      proxyUrl.searchParams.set('disableCache', true);
      return proxyUrl.toString();
    },
  };
  const form = document.querySelector('form');
  const erroBlock = document.getElementById('error-text');
  console.log(erroBlock.textContent);
  const watchedState = getWatchedState(defaultState, i18Instance);
  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      watchedState.form.status = 'loading';
      if (!response.data.length) {
        throw new Error('errors.network');
      }
      watchedState.form.status = 'success';
      return response.data;
    } catch (error) {
      setErrorText(i18Instance.t('errors.network'));
      watchedState.form.status = 'error';
      erroBlock.textContent = defaultState.error;
    }
    return null;
  };
  const validationScheme = yup.object().shape({
    url: yup.string().url().required(),
  });
  const validation = async (string) => {
    try {
      const valid = await validationScheme.validate({ url: string });
      setInputValue(valid.url);
      return valid;
    } catch (error) {
      watchedState.form.status = 'error';
      setErrorText(i18Instance.t('errors.url'));
      erroBlock.textContent = defaultState.error;
      return null;
    }
  };
  const parseRss = (string) => {
    const parser = new DOMParser();
    const rss = parser.parseFromString(string, 'text/xml');
    const error = rss.querySelector('parsererror');
    console.log(error);
    if (error) {
      watchedState.form.status = 'error';
      setErrorText(i18Instance.t('errors.rssNotFound'));
      return { error };
    }
    return rss;
  };
  const buildRss = (document) => {
    const { error } = document;
    if (error) {
      erroBlock.textContent = defaultState.error;
      return;
    }

    const feeds = {
      title: document.querySelector('title').textContent,
      description: document.querySelector('description').textContent,
    };
    const items = document.querySelectorAll('channel item');
    const newItems = Array.from(items).map((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemDescr = item.querySelector('description').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { title: itemTitle, description: itemDescr, link: itemLink };
    });
    watchedState.posts.push(...newItems);
    watchedState.feeds.push(feeds);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    watchedState.form.status = 'initial';
    try {
      watchedState.form.status = 'pending';
      const formData = new FormData(form);
      const url = formData.get('url');
      const validationResult = await validation(url);
      if (!validationResult) {
        throw new Error('errors.url');
      }
      const data = await fetchData(url);
      const parsedXml = parseRss(data);
      buildRss(parsedXml);
    } catch (error) {
      setErrorText(error.message);
    }
  };
  form.addEventListener('submit', handleSubmit);
};
export default startApp;
