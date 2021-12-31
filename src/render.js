/* eslint-disable no-param-reassign */

const renderModal = (post, readedPost) => {
	const modal = document.getElementById("modal")

	const closeBtns = modal.querySelectorAll('button[data-dismiss="modal"]')
	modal.classList.remove("remove")
	modal.classList.add("show")
	closeBtns.forEach((el) =>
		el.addEventListener("click", () => {
			modal.classList.add("remove")
			modal.classList.remove("show")
		})
	)
	const modalTitle = modal.querySelector(".modal-title")
	const modalBody = modal.querySelector(".modal-body")
	const linkBtn = modal.querySelector(".link")
	const { title, description, url } = post
	modalTitle.textContent = title
	linkBtn.href = url
	modalBody.append(description)
	readedPost.push(post.id)
}

const renderPosts = ({ posts, readedPost }, i18Instance) => {
	const postsNode = document.querySelector(".posts")
	postsNode.replaceChildren()

	const headerPostNode = document.createElement("h3")
	headerPostNode.classList.add("fw-bold")
	headerPostNode.textContent = i18Instance.t("posts")

	const listNode = document.createElement("ul")
	listNode.classList.add("list-group")

	posts.forEach(({ title, url, description }) => {
		const postNode = document.createElement("li")
		postNode.classList.add(
			"list-group-item",
			"d-flex",
			"justify-content-between",
			"align-items-start"
		)

		const linkNode = document.createElement("a")
		linkNode.classList.add("fw-bold")
		linkNode.href = url
		linkNode.setAttribute("target", "_blank")
		linkNode.setAttribute("rel", "noopener noreferrer")
		linkNode.textContent = title

		const buttonNode = document.createElement("button")
		buttonNode.type = "button"
		buttonNode.classList.add("btn", "btn-primary", "btn-sm", "flex")
		buttonNode.textContent = i18Instance.t("openModalBtn")

		buttonNode.onclick = () => {
			renderModal({ title, description, url }, readedPost)
			linkNode.classList.remove("fw-bold")
			linkNode.classList.add("fw-normal")
		}
		postNode.append(linkNode)
		listNode.append(postNode)
		postNode.append(buttonNode)
	})
	postsNode.append(headerPostNode)
	postsNode.append(listNode)
}

const renderFeedback = (status, i18nextInstance, proccesState) => {
	const feedbackElement = document.querySelector("#feedback")
	switch (status) {
		case "error": {
			feedbackElement.textContent = i18nextInstance.t(proccesState)
			feedbackElement.classList.remove("text-success")
			feedbackElement.classList.add("text-danger")
			break
		}
		case "loading": {
			feedbackElement.textContent = i18nextInstance.t(proccesState)
			feedbackElement.classList.remove("text-danger")
			feedbackElement.classList.add("text-success")
			break
		}
		case "success": {
			feedbackElement.textContent = i18nextInstance.t(proccesState)
			feedbackElement.classList.remove("text-danger")
			feedbackElement.classList.add("text-success")
			break
		}
		default:
			break
	}
	// if (feedback === "success") {
	// 	feedbackElement.textContent = i18nextInstance.t("successFeedback")
	// 	feedbackElement.classList.remove("text-danger")
	// 	feedbackElement.classList.add("text-success")
	// 	return
	// }
	// if (feedback instanceof Error) {
	// 	feedbackElement.textContent = i18nextInstance.t(
	// 		`errors.${feedback.message}`
	// 	)
	// 	feedbackElement.classList.remove("text-success")
	// 	feedbackElement.classList.add("text-danger")
	// }
}
const renderError = (value, i18Instance, proccesState) => {
	renderFeedback(value, i18Instance, proccesState)
}
const renderForm = (status) => {
	const formElement = document.querySelector("form")
	const inputElement = formElement.querySelector("input")
	const submitButton = formElement.querySelector("button")
	if (status) {
		inputElement.setAttribute("readonly", true)
		formElement.setAttribute("disabled", true)
		submitButton.setAttribute("disabled", true)
	} else {
		inputElement.removeAttribute("readonly")
		formElement.removeAttribute("disabled")
		submitButton.removeAttribute("disabled")
	}
}

const renderFeeds = (feeds, i18Instance) => {
	const feedsElement = document.querySelector(".feeds")
	feedsElement.replaceChildren()
	const headingElement = document.createElement("h2")
	headingElement.textContent = i18Instance.t("feeds")

	const listElement = document.createElement("ul")
	listElement.classList.add("list-group", "mb-5")

	feedsElement.appendChild(headingElement)
	feedsElement.appendChild(listElement)

	feeds.forEach(({ title, description }) => {
		const feedElement = document.createElement("li")
		feedElement.classList.add("list-group-item")

		const titleElement = document.createElement("h4")
		titleElement.textContent = title

		const descriptionElement = document.createElement("p")
		descriptionElement.textContent = description

		feedElement.appendChild(titleElement)
		feedElement.appendChild(descriptionElement)
		listElement.appendChild(feedElement)
	})
}

export { renderForm, renderFeeds, renderPosts, renderFeedback, renderError }
