import axios from 'axios';
import _ from 'lodash';
import parseRss from './parser';

// const route = {
//   api: (url) => {
//     const endPoint = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
//     endPoint.searchParams.set('disableCache', 'true');
//     endPoint.searchParams.set('url', url);
//     return endPoint.toString();
//   },
// };

const fetchData = async (url) => {
  try {
    // const proxifiedUrl = route.api(url);
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    throw new Error('network');
  }
};

export const FETCHING_TIMEOUT = 5000;

export const fetchNewPosts = (watchedState) => {
  const promises = watchedState.feeds.map((feed) =>
    fetchData(feed.url)
      .then((contents) => {
        const feedData = parseRss(contents);
        const newPosts = feedData.posts.map((item) => ({
          ...item,
          feedId: feed.id,
        }));
        const oldPosts = watchedState.posts.filter(
          (post) => post.feedId === feed.id
        );
        const posts = _.differenceBy(newPosts, oldPosts, 'title').map(
          (post) => ({ ...post, id: new Date() })
        );
        if (posts.length > 0) {
          watchedState.posts.push(posts);
          console.log('new posts');
        }
      })
      .catch(console.error)
  );

  Promise.all(promises).finally(() => {
    setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT);
  });
};

export default fetchData;
