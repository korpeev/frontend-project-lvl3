const parseRss = (data) => {
  const parser = new DOMParser();
  const rssDocument = parser.parseFromString(data, 'application/xml');
  const parseError = rssDocument.querySelector('parsererror');
  if (parseError) {
    const textError = parseError.textContent;
    const error = new Error(textError);
    error.isRssParseError = true;
    throw error;
  }
  const elements = {
    feeds: {
      title: rssDocument.querySelector('channel title').textContent,
      description: rssDocument.querySelector('channel description').textContent,
      link: rssDocument.querySelector('channel link').textContent,
    },
    items: rssDocument.querySelectorAll('channel item'),
  };
  const posts = Array.from(elements.items).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    url: item.querySelector('link').textContent,
    pubDate: new Date(item.querySelector('pubDate').textContent),
  }));
  return { ...elements.feeds, posts };
};

export default parseRss;
