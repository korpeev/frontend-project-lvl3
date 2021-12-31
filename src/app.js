import { v4 as uuidv4 } from "uuid"
import i18next from "i18next"
import { setLocale } from "yup"
import resources from "./locale/index.js"
import yupLocale from "./locale/yup.js"
import getWatchedState from "./watchedState.js"
import validator from "./utils/validator.js"
import fetchData, {
	FETCHING_TIMEOUT,
	fetchNewPosts,
} from "./utils/fetchData.js"
import parseRss from "./utils/parser.js"

export default async () => {
	const i18Instance = i18next.createInstance()
	await i18Instance.init({ lng: "ru", debug: false, resources })
	setLocale(yupLocale)
	const defaultState = {
		feeds: [],
		posts: [],
		error: "",
		addingPosts: "",
		proccesState: "",
		form: {
			isValid: null,
		},
		readedPost: [],
	}

	const formElement = document.querySelector("form")
	const inputElement = formElement.querySelector("input")
	const watchedState = getWatchedState(defaultState, i18Instance)
	const handleSubmit = (e) => {
		e.preventDefault()
		const formData = new FormData(e.target)
		const url = formData.get("url")
		watchedState.form.isValid = true
		validator(url, watchedState.feeds)
			.then((link) => {
				watchedState.error = null
				return link
			})
			.then((link) => {
				watchedState.proccesState = "loading"
				watchedState.addingPosts = "loading"
				inputElement.classList.remove("is-invalid")
				return fetchData(link)
			})
			.then((response) => {
				const { title, description, posts } = parseRss(response.data.contents)
				const id = uuidv4()
				watchedState.feeds.push({
					title,
					id,
					description,
					url,
				})
				const modifyPosts = [
					...posts.map((post) => ({ ...post, feedId: id, id: uuidv4() })),
				]
				watchedState.posts.push(...modifyPosts)
				watchedState.proccesState = "success"
				watchedState.addingPosts = "success"
				formElement.reset()
				inputElement.classList.remove("is-invalid")
				inputElement.focus()
			})
			.catch((error) => {
				if (error.name === "ValidationError") {
					watchedState.proccesState = error.message
					watchedState.addingPosts = "error"
					watchedState.form.isValid = false
					watchedState.error = error.error
					inputElement.classList.add("is-invalid")
				}
				if (error.isRssParseError) {
					watchedState.proccesState = "errors.rssNotFound"
					watchedState.addingPosts = "error"
				}
			})
	}

	formElement.addEventListener("submit", handleSubmit)
	setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT)
}
