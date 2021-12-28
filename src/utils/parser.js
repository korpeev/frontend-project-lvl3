const parseRss = (data) => {
	const parser = new DOMParser()
	const rssDocument = parser.parseFromString(data, "application/xml")
	const parserError = rssDocument.querySelector("parsererror")
	if (parserError) {
		throw new Error("rssNotFound")
	}
	const elements = {
		feeds: {
			title: rssDocument.querySelector("channel title").textContent,
			description: rssDocument.querySelector("channel description").textContent,
			link: rssDocument.querySelector("channel link").textContent,
		},
		items: rssDocument.querySelectorAll("channel item"),
	}
	const posts = Array.from(elements.items).map((item) => ({
		title: item.querySelector("title").textContent,
		description: item.querySelector("description").textContent,
		url: item.querySelector("link").textContent,
		pubDate: new Date(item.querySelector("pubDate").textContent),
	}))
	return { ...elements.feeds, posts }
}

export default parseRss
