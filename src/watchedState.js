import onChange from "on-change"
import {
	renderForm,
	renderPosts,
	renderFeeds,
	renderModal,
	renderFeedback,
} from "./render.js"

const getWatchedState = (state, i18Instance) =>
	onChange(state, (path, value) => {
		switch (path) {
			case "posts": {
				renderPosts(value, i18Instance, state)
				break
			}
			case "form.status": {
				renderForm(value, i18Instance)
				renderFeedback(value, i18Instance)
				break
			}
			case "error":
				renderFeedback(value, i18Instance)
				break
			case "feeds":
				renderFeeds(value, i18Instance)
				break
			case "openedPostId":
				renderModal(state, value)
				break
			default:
				break
		}
	})

export default getWatchedState
