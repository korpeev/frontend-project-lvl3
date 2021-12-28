import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import _ from "lodash"
import parseRss from "./parser.js"

const proxyfy = (url) =>
	new URL(
		`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`
	).toString()
const fetchData = async (url) => {
	try {
		const response = await axios.get(proxyfy(url))
		return response.data
	} catch (error) {
		throw new Error("network")
	}
}

export const FETCHING_TIMEOUT = 5000

export const fetchNewPosts = (watchedState) => {
	const promises = watchedState.feeds.map((feed) =>
		fetchData(feed.url)
			.then((contents) => {
				const feedData = parseRss(contents)
				const newPosts = feedData.posts.map((item) => ({
					...item,
					feedId: feed.id,
				}))
				const oldPosts = watchedState.posts.filter(
					(post) => post.feedId === feed.id
				)
				const posts = _.differenceBy(newPosts, oldPosts, "title").map(
					(post) => ({ ...post, id: uuidv4() })
				)
				if (posts.length > 0) {
					watchedState.posts.unshift(posts)
					console.log("new posts")
				}
			})
			.catch(() => {
				throw new Error("network")
			})
	)

	Promise.all(promises).finally(() => {
		setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT)
	})
}

export default fetchData
