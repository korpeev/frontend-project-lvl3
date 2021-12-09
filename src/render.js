import i18next from 'i18next';
import hooks from './hooks';

const renderFormInput = (state, value) => {
  const input = document.getElementById('url-input');
  input.value = value;
};

const renderPosts = (value) => {
  const posts = document.querySelector('.posts');
  const foramtedPosts = value.map(
    (post) => `<div>
        <h3><a href='${post.link}'>${post.title}</a></h3>
        <p>${post.description}</p>
    </div>`
  );
  posts.innerHTML = foramtedPosts.join('');
};

const renderForm = (state, value, i18Instance) => {
  const input = document.getElementById('url-input');
  const button = document.querySelector('button[type="submit"]');
  const errorBlock = document.getElementById('error-text');
  const { setInputValue } = hooks(state);
  switch (value) {
    case 'initial':
      input.classList.remove('border-danger');
      input.focus();
      break;
    case 'pending':
      setInputValue('');
      button.disabled = true;
      errorBlock.classList.remove('text-danger');
      errorBlock.classList.add('text-info');
      console.log(i18Instance.t('sending'));
      errorBlock.textContent = i18Instance.t('sending');
      break;
    case 'loading':
      errorBlock.textContent = i18Instance.t('loading');
      break;
    case 'success':
      errorBlock.classList.remove('text-info');
      errorBlock.classList.add('text-success');
      errorBlock.textContent = i18Instance.t('successFeedback');
      button.disabled = false;
      break;
    case 'error':
      button.disabled = false;
      errorBlock.classList.remove('text-succes');
      errorBlock.classList.add('text-danger');
      break;
    default:
      break;
  }
};

export { renderFormInput, renderForm, renderPosts };
