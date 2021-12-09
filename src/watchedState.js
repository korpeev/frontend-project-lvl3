import onChange from 'on-change';
// eslint-disable-next-line import/no-cycle
import { renderFormInput, renderForm, renderPosts } from './render';

const getWatchedState = (state, i18Instance) =>
  onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'input': {
        renderFormInput(state, value);
        break;
      }
      case 'posts': {
        renderPosts(value);
        break;
      }
      case 'form.status': {
        state.form.status.replace(prevValue, value);
        renderForm(state, value, i18Instance);
        break;
      }
      default:
        break;
    }
  });

export default getWatchedState;
