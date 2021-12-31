/* eslint-disable no-param-reassign */

const renderModal = (post, readedPost) => {
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
  modalBody.append(description);
  readedPost.push(post.id);
};

const renderPosts = ({ posts, readedPost }, i18Instance) => {
  const postsNode = document.querySelector('.posts');
  postsNode.replaceChildren();

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
      'justify-content-between',
      'align-items-start'
    );

    const linkNode = document.createElement('a');
    linkNode.classList.add('fw-bold');
    linkNode.href = url;
    linkNode.setAttribute('target', '_blank');
    linkNode.setAttribute('rel', 'noopener noreferrer');
    linkNode.textContent = title;

    const buttonNode = document.createElement('button');
    buttonNode.type = 'button';
    buttonNode.classList.add('btn', 'btn-primary', 'btn-sm', 'flex');
    buttonNode.textContent = i18Instance.t('openModalBtn');

    buttonNode.onclick = () => {
      renderModal({ title, description, url }, readedPost);
      linkNode.classList.remove('fw-bold');
      linkNode.classList.add('fw-normal');
    };
    postNode.append(linkNode);
    listNode.append(postNode);
    postNode.append(buttonNode);
  });
  postsNode.append(headerPostNode);
  postsNode.append(listNode);
};

const renderFeedback = (status, i18nextInstance, proccesState) => {
  const feedbackElement = document.querySelector('#feedback');
  const sumbitButton = document.querySelector('button[type="submit"]');
  const input = document.querySelector('#url-input');
  switch (status) {
    case 'error': {
      feedbackElement.textContent = i18nextInstance.t(proccesState);
      feedbackElement.classList.remove('text-success');
      feedbackElement.classList.add('text-danger');
      sumbitButton.removeAttribute('disabled');
      input.removeAttribute('readonly');
      break;
    }
    case 'loading': {
      feedbackElement.textContent = i18nextInstance.t(proccesState);
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      sumbitButton.setAttribute('disabled', true);
      input.setAttribute('readonly', true);
      break;
    }
    case 'success': {
      feedbackElement.textContent = i18nextInstance.t(proccesState);
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      sumbitButton.removeAttribute('disabled');
      input.removeAttribute('readonly');
      break;
    }
    default:
      break;
  }
};

const renderFeeds = (feeds, i18Instance) => {
  const feedsElement = document.querySelector('.feeds');
  feedsElement.replaceChildren();
  const headingElement = document.createElement('h2');
  headingElement.textContent = i18Instance.t('feeds');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-group', 'mb-5');

  feedsElement.appendChild(headingElement);
  feedsElement.appendChild(listElement);

  feeds.forEach(({ title, description }) => {
    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item');

    const titleElement = document.createElement('h4');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    feedElement.appendChild(titleElement);
    feedElement.appendChild(descriptionElement);
    listElement.appendChild(feedElement);
  });
};

export { renderFeeds, renderPosts, renderFeedback };
