import onChange from "on-change"
import {
	renderForm,
	renderPosts,
	renderFeeds,
	renderFeedback,
	renderError,
} from "./render.js"

const getWatchedState = (state, i18Instance) =>
	onChange(state, (path, value) => {
		if (path === "form.isValid") {
			if (!value) {
				renderError(state.error, i18Instance)
				renderForm(value, i18Instance)
			}
		}
		if (path === "addingPosts") {
			switch (value) {
				case "loading": {
					renderFeedback(value, i18Instance, state.proccesState)

					break
				}
				case "error": {
					renderError(value, i18Instance, state.proccesState)
					break
				}
				case "success": {
					renderFeedback(value, i18Instance, state.proccesState)
					renderFeeds(state.feeds, i18Instance)
					renderPosts(state, i18Instance)
					break
				}
				default:
					renderError(value, i18Instance, state.proccesState)
			}
		}
	})

export default getWatchedState
