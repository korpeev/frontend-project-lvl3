import onChange from 'on-change';
import { renderPosts, renderFeeds, renderFeedback } from './render.js';

const getWatchedState = (state, i18Instance) => onChange(state, (path, value) => {
  const form = document.getElementById('rss-form');
  if (path === 'form.isValid') {
    if (!value) {
      renderFeedback('error', i18Instance, state.processError);
    }
  }
  if (path === 'addingPosts') {
    switch (value) {
      case 'loading': {
        renderFeedback(value, i18Instance, value);
        break;
      }
      case 'error': {
        renderFeedback(value, i18Instance, state.processError);
        break;
      }
      case 'success': {
        renderFeedback(value, i18Instance, value);
        renderFeeds(state.feeds, i18Instance);
        renderPosts(state, i18Instance);
        form.reset();
        break;
      }
      default:
        throw Error('Something went wrong');
    }
  }
});

export default getWatchedState;
