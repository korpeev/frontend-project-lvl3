import onChange from "on-change"
import { renderPosts, renderFeeds, renderFeedback } from "./render.js"

const getWatchedState = (state, i18Instance) =>
	onChange(state, (path, value) => {
		if (path === "form.isValid") {
			if (!value) {
				renderFeedback("error", i18Instance, state.proccesState)
			}
		}
		if (path === "addingPosts") {
			switch (value) {
				case "loading": {
					renderFeedback(value, i18Instance, state.proccesState)
					break
				}
				case "error": {
					renderFeedback(value, i18Instance, state.proccesState)
					break
				}
				case "success": {
					renderFeedback(value, i18Instance, state.proccesState)
					renderFeeds(state.feeds, i18Instance)
					renderPosts(state, i18Instance)
					break
				}
				default:
					throw Error("Something went wrong")
			}
		}
	})

export default getWatchedState
