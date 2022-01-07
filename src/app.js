import { v4 as uuidv4 } from 'uuid';
import i18next from 'i18next';
import axios from 'axios';
import { setLocale } from 'yup';
import resources from './locale/index.js';
import yupLocale from './locale/yup.js';
import getWatchedState from './watchedState.js';
import validator from './utils/validator.js';
import fetchData, {
  FETCHING_TIMEOUT,
  fetchNewPosts,
} from './utils/fetchData.js';
import parseRss from './utils/parser.js';

export default async () => {
  const i18Instance = i18next.createInstance();
  await i18Instance.init({ lng: 'ru', debug: false, resources });
  setLocale(yupLocale);
  const defaultState = {
    feeds: [],
    posts: [],
    error: '',
    addingFeeds: '',
    processError: '',
    form: {
      isValid: null,
    },
    readedPost: [],
  };

  const formElement = document.querySelector('form');
  const watchedState = getWatchedState(defaultState, i18Instance);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.isValid = true;
    validator(url, watchedState.feeds)
      .then((link) => {
        watchedState.error = null;
        watchedState.addingFeeds = 'loading';
        return fetchData(link);
      })
      .then((response) => {
        const { title, description, posts } = parseRss(response.data.contents);
        const id = uuidv4();
        watchedState.feeds.push({
          title,
          id,
          description,
          url,
        });
        const modifyPosts = posts.map((post) => ({
          ...post,
          feedId: id,
          id: uuidv4(),
        }));
        watchedState.posts.push(...modifyPosts);
        watchedState.addingFeeds = 'success';
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          watchedState.processError = error.message;
          watchedState.addingFeeds = 'error';
          watchedState.form.isValid = false;
          watchedState.error = error.error;
        } else if (error.isRssParseError) {
          watchedState.processError = 'errors.rssNotFound';
          watchedState.addingFeeds = 'error';
        } else if (axios.isAxiosError(error)) {
          watchedState.processError = 'errors.network';
          watchedState.addingFeeds = 'error';
        }
      });
  };

  formElement.addEventListener('submit', handleSubmit);
  setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT);
};
