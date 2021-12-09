import getWatchedState from './watchedState';
import validator from './utils/validator';
import fetchData from './utils/fetchData';

const startApp = (i18Instance) => {
  const defaultState = {
    feeds: [],
    posts: [],
    error: '',
    form: {
      status: 'initial',
    },
  };
  // Потом исправлю, почему то с прокси запрос не идет!!!
  // const proxy = (url) =>
  //   `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
  //     url
  //   )}`;
  const formElement = document.querySelector('form');
  const inputElement = document.getElementById('url-input');
  const watchedState = getWatchedState(defaultState, i18Instance);

  const parseRss = (data) => {
    try {
      const parser = new DOMParser();
      const rssDocument = parser.parseFromString(data, 'application/xml');
      console.log(rssDocument.querySelector('rss'));
      const elements = {
        feeds: {
          title: rssDocument.querySelector('channel title').textContent,
          description: rssDocument.querySelector('channel description')
            .textContent,
          link: rssDocument.querySelector('channel link').textContent,
        },
        items: rssDocument.querySelectorAll('channel item'),
      };
      const posts = Array.from(elements.items).map((item) => ({
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        url: item.querySelector('link').textContent,
        pubDate: new Date(item.querySelector('pubDate').textContent),
      }));
      return { ...elements.feeds, posts };
    } catch (error) {
      throw new Error('rssNotFound');
    }
  };

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
        return fetchData(link);
      })
      .then((response) => {
        const { title, description, posts } = parseRss(response);
        const id = Date.now();
        watchedState.feeds.push({
          title,
          id,
          description,
          url,
        });
        const modifyPosts = [...posts.map((post) => ({ ...post, feedId: id }))];
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
};
export default startApp;
