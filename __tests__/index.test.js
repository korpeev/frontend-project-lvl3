/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom';
import testingLibrary from '@testing-library/dom';
import { expect, test, beforeEach } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import init from '../src/init.js';

const { screen, waitFor, fireEvent } = testingLibrary;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) =>
  path.resolve(__dirname, '__fixtures__', filename);

let elements;
beforeEach(() => {
  const initHtml = fs.readFileSync(getFixturePath('index.html')).toString();
  document.body.innerHTML = initHtml;
  init();
  elements = {
    input: screen.getByTestId('url-input'),
    form: screen.getByTestId('rss-form'),
    feedback: screen.getByTestId('feedback'),
  };
});

test('invalid url', async () => {
  fireEvent.input(elements.input, { target: { value: 'FizzBuzz' } });
  fireEvent.submit(elements.form);
  await waitFor(() =>
    expect(screen.getByText('Ссылка должна быть валидным URL'))
  );
});

test('invalid format', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
    })
    .get(
      `/get?disableCache=true&url=${encodeURIComponent(
        'https://www.google.com/'
      )}`
    )
    .reply(200, { contents: 'FizzBuzz' });

  fireEvent.input(elements.input, {
    target: { value: 'https://www.google.com/' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() =>
    expect(screen.getByText('Ресурс не содержит валидный RSS'))
  );
});
// Потом исправлю, почему то прокси не работает у меня!!
test('valid rss and duplicate', async () => {
  const validRSS = fs.readFileSync(getFixturePath('lessons.xml')).toString();
  const nockFetch = nock('https://hexlet-allorigins.herokuapp.com')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
    })
    .get((uri) => uri.includes('get'))
    .reply(200, { data: validRSS });
  console.log(nockFetch);
  fireEvent.input(elements.input, {
    target: {
      value: 'https://news.google.com/rss?topic=h&hl=en-US&gl=US&ceid=US:en',
    },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText('RSS успешно загружен')));
  fireEvent.input(elements.input, {
    target: {
      value: 'https://news.google.com/rss?topic=h&hl=en-US&gl=US&ceid=US:en',
    },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText('RSS уже существует')));
});
