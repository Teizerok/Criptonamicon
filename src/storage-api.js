

export const getStorage = nameItem => {
	return JSON.parse(localStorage.getItem(nameItem))
}

export const setStorage = (nameItem, value) => {
	localStorage.setItem(nameItem, JSON.stringify(value));
}