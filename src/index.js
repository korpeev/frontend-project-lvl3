import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import getWatchedState from './watchedState';

const startApp = async () => {
  const form = document.querySelector('form');
  const defaultState = {
    input: '',
    feeds: [],
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    const watchedState = await getWatchedState(defaultState);
    watchedState.input = url;
  });
};

startApp();
