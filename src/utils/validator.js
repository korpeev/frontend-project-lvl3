import * as yup from "yup"

const validator = (validationUrl, data) => {
	const validationScheme = yup
		.string()
		.url()
		.required()
		.notOneOf(
			data.map(({ url }) => url),
			"errors.duplicate"
		)
	const validated = validationScheme.validate(validationUrl)
	return validated
}

export default validator
