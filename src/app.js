import { v4 as uuidv4 } from 'uuid';
import getWatchedState from './watchedState.js';
import validator from './utils/validator.js';
import fetchData, {
  FETCHING_TIMEOUT,
  fetchNewPosts,
} from './utils/fetchData.js';
import parseRss from './utils/parser.js';

const startApp = (i18Instance) => {
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

  const formElement = document.getElementById('rss-form');
  const inputElement = document.getElementById('url-input');
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
export default startApp;
