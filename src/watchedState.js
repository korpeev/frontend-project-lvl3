import onChange from 'on-change';
import {
  renderForm,
  renderPosts,
  renderFeedback,
  renderFeeds,
  renderModal,
} from './render';

const getWatchedState = (state, i18Instance) =>
  onChange(state, (path, value) => {
    switch (path) {
      case 'posts': {
        renderPosts(value, i18Instance, state);
        break;
      }
      case 'form.status': {
        renderForm(value);
        renderFeedback(value, i18Instance);
        break;
      }
      case 'error':
        renderFeedback(value, i18Instance);
        break;
      case 'feeds':
        renderFeeds(value, i18Instance);
        break;
      case 'openedPostId':
        console.log(path, value);
        renderModal(state, value);
        break;
      default:
        break;
    }
  });

export default getWatchedState;
