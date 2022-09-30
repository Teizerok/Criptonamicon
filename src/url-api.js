export const pushURL = (filter, page) => {
	history.pushState(
		null,
		document.title,
		`${location.pathname}?filter=${filter}&page=${page}`
	);
}

export const getURL = key => {
	const params = Object.fromEntries(new URL(location).searchParams)
	return params[key]

}