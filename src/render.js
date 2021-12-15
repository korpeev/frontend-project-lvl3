/* eslint-disable no-param-reassign */

const renderModal = (post) => {
  const modal = document.getElementById('modal');

  const closeBtns = modal.querySelectorAll('button[data-dismiss="modal"]');
  modal.classList.remove('remove');
  modal.classList.add('show');
  closeBtns.forEach((el) =>
    el.addEventListener('click', () => {
      modal.classList.add('remove');
      modal.classList.remove('show');
    })
  );
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const linkBtn = modal.querySelector('.link');
  const { title, description, url } = post;
  modalTitle.textContent = title;
  linkBtn.href = url;
  modalBody.textContent = description;
};

const renderPosts = (posts, i18Instance) => {
  const postsNode = document.querySelector('.posts');
  // postsNode.innerHTML = '';

  const headerPostNode = document.createElement('h3');
  headerPostNode.classList.add('fw-bold');
  headerPostNode.textContent = i18Instance.t('posts');

  const listNode = document.createElement('ul');
  listNode.classList.add('list-group');

  posts.forEach(({ title, url, description }) => {
    const postNode = document.createElement('li');
    postNode.classList.add(
      'list-group-item',
      'd-flex',
      'flex-column',
      'justify-content-between',
      'align-items-start'
    );

    const linkNode = document.createElement('a');
    linkNode.classList.add('fw-bold');
    linkNode.href = url;
    linkNode.setAttribute('target', '_blank');
    linkNode.setAttribute('rel', 'noopener noreferrer');
    linkNode.textContent = title;

    const parahraphNode = document.createElement('p');
    parahraphNode.textContent = description;

    const buttonNode = document.createElement('button');
    buttonNode.type = 'button';
    buttonNode.classList.add('btn', 'btn-primary', 'btn-sm', 'flex');
    buttonNode.textContent = i18Instance.t('openModalBtn');

    buttonNode.onclick = () => {
      renderModal({ title, description, url });
      linkNode.classList.remove('fw-bold');
      linkNode.classList.add('fw-normal');
    };
    postNode.append(linkNode);
    postNode.append(parahraphNode);
    listNode.append(postNode);
    postNode.append(buttonNode);
  });
  postsNode.append(headerPostNode);
  postsNode.append(listNode);
};

const renderFeedback = (feedback, i18nextInstance) => {
  const feedbackElement = document.querySelector('#feedback');
  if (feedback === 'success') {
    feedbackElement.textContent = i18nextInstance.t('successFeedback');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    return;
  }
  if (feedback instanceof Error) {
    feedbackElement.textContent = i18nextInstance.t(
      `errors.${feedback.message}`
    );
    feedbackElement.classList.remove('text-success');
    feedbackElement.classList.add('text-danger');
  }
};

const renderForm = (status, i18nInstance) => {
  const feedbackElement = document.querySelector('#feedback');
  const formElement = document.querySelector('form');
  const inputElement = formElement.querySelector('input');
  const submitButton = formElement.querySelector('button');
  if (!inputElement.value) {
    feedbackElement.textContent = i18nInstance.t('errors.required');
  }
  if (status === 'pending') {
    inputElement.setAttribute('readonly', true);
    formElement.setAttribute('disabled', true);
    submitButton.setAttribute('disabled', true);
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = i18nInstance.t('loading');
  } else {
    inputElement.removeAttribute('readonly');
    formElement.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
  }
};

const renderFeeds = (feeds, i18Instance) => {
  const feedsElement = document.querySelector('.feeds');

  const headingElement = document.createElement('h2');
  headingElement.textContent = i18Instance.t('feeds');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-group', 'mb-5');

  feedsElement.appendChild(headingElement);
  feedsElement.appendChild(listElement);

  feeds.forEach(({ title, description }) => {
    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item');

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    feedElement.appendChild(titleElement);
    feedElement.appendChild(descriptionElement);
    listElement.appendChild(feedElement);
  });
};

export { renderForm, renderModal, renderFeeds, renderPosts, renderFeedback };
