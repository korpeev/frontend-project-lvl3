import onChange from 'on-change';
import * as yup from 'yup';

const getWatchedState = (state) =>
  onChange(state, (path, value) => {
    const input = document.getElementById('url-input');
    const errorText = document.getElementById('error-text');
    const validateSheme = yup.object().shape({
      url: yup.string().url().required(),
    });
    try {
      validateSheme.validateSync({ url: value });
      input.value = '';
      input.focus();
    } catch (error) {
      input.classList.add('border-danger');
      errorText.classList.remove('opacity-0');
      console.log(error);
    }
  });

export default getWatchedState;
