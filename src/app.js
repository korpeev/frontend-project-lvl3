import { v4 as uuidv4 } from 'uuid';
import i18next from 'i18next';
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
  await i18Instance.init({ lng: 'ru', debug: true, resources });
  setLocale(yupLocale);
  const defaultState = {
    feeds: [],
    posts: [],
    error: '',
    form: {
      status: 'initial',
    },
    openedPostId: null,
    readedPost: null,
  };

  const formElement = document.querySelector('form');
  const inputElement = formElement.querySelector('input');
  const watchedState = getWatchedState(defaultState, i18Instance);
  const handleSubmit = (e) => {
    e.preventDefault();
    watchedState.form.status = 'initial';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validator(url, watchedState.feeds)
      .then((link) => {
        watchedState.error = null;
        return link;
      })
      .then((link) => {
        watchedState.form.status = 'pending';
        inputElement.classList.remove('is-invalid');
        return fetchData(link.trim());
      })
      .then((response) => {
        const { title, description, posts } = parseRss(response);
        const id = uuidv4();
        watchedState.feeds.push({
          title,
          id,
          description,
          url,
        });
        const modifyPosts = [
          ...posts.map((post) => ({ ...post, feedId: id, id: uuidv4() })),
        ];
        watchedState.posts.push(...modifyPosts);
        watchedState.form.status = 'success';
        formElement.reset();
        inputElement.classList.remove('is-invalid');
        inputElement.focus();
      })
      .catch((error) => {
        watchedState.form.status = 'error';
        inputElement.classList.add('is-invalid');
        watchedState.error = error;
      });
  };
  formElement.addEventListener('submit', handleSubmit);
  setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT);
};
