import getWatchedState from './watchedState';

export default (...args) => {
  const watchedState = getWatchedState(...args);
  const setInputValue = (value) => {
    watchedState.input = value;
  };

  const setErrorText = (errorMessage) => {
    watchedState.error = errorMessage;
  };

  return {
    setInputValue,
    setErrorText,
  };
};
