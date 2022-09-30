//! Константы

const AGGREGATE_INDEX = '5'
const INVALID_INDEX = '500'
const WELCOME_MESSAGE = '20'
const STORAGE_LIST_TICKERS = 'storageListTickers'

//! флажок главной вкладки
let mainPage = false


const API_KEY = '5ff65a94e2a513aaf89d274667c235bdf9c30f94ff89d715470c2c8f3e9e50b7'
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)


const subcribedTickers = new Map()
const downloadTickers = {}




//! Вызов CallBack в App.vue 

const callback = (tickerName, tickerPrice, isHasTicker) => {
	const handlers = subcribedTickers.get(tickerName) ?? []
	const tickerPriceFormat = tickerPrice === '-' ? tickerPrice : +tickerPrice
	if (isHasTicker === 'false') {
		handlers.forEach(fn => fn(tickerPriceFormat, false))
		return
	}
	handlers.forEach(fn => fn(tickerPriceFormat, isHasTicker))

}


//! загрузка в LS
const loadToStorage = (curency, price, isHasTicker) => {
	downloadTickers[curency] = `${price},${isHasTicker}`
	localStorage.setItem(STORAGE_LIST_TICKERS, JSON.stringify(downloadTickers))
}

//! подписка на обновление LS
const uploadFromStorage = () => {
	window.addEventListener('storage', () => {
		const tickersFromLocalStorage = JSON.parse(localStorage.getItem(STORAGE_LIST_TICKERS))
		for (let curency in tickersFromLocalStorage) {
			let [price, isHasTicker] = tickersFromLocalStorage[curency].split(',')
			callback(curency, price, isHasTicker)

		}
	})
}


//! событие когда WebSocket отвечает 

socket.addEventListener('message', e => {
	const { TYPE: type, PRICE: price, FROMSYMBOL: curency, PARAMETER: parameter } = JSON.parse(e.data)


	if (type === WELCOME_MESSAGE) {
		mainPage = true
		return
	}

	if (!mainPage) {
		uploadFromStorage()
		return
	}


	let isHasTicker = true

	if (type === INVALID_INDEX) {
		const curency = parameter.split('~')[2]

		setInterval(() => {
			fetch(`https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${curency}`)
				.then(r => r.json())
				.then(dataBTC => {
					if (dataBTC[curency] === undefined) {
						isHasTicker = false


						callback(curency, '-', isHasTicker)
						return
					}

					fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC`)
						.then(r => r.json())
						.then(dataUSD => {
							const curseToBTC = 1 / dataBTC[curency]
							const curseToUSD = 1 / dataUSD.BTC
							const resultCurse = curseToBTC * curseToUSD

							loadToStorage(curency, resultCurse, isHasTicker)
							callback(curency, resultCurse, isHasTicker)
						})
				})
		}, 1500)
		return
	}

	//! проверка валидности параметров цены, и type
	if (type !== AGGREGATE_INDEX || price === undefined) {
		return
	}

	loadToStorage(curency, price, isHasTicker)
	callback(curency, price, isHasTicker)
})




//! Отправка сообщения по WebSocket

const sendTickerOnWS = (message) => {
	const stryngyfiedMessage = JSON.stringify(message)

	if (socket.readyState === socket.OPEN) {
		socket.send(stryngyfiedMessage)
		return
	}

	socket.addEventListener('open', () => {
		socket.send(stryngyfiedMessage)
	}, { once: true })
}



//! сообщение подписания на тикер

const updateTickerOnWebSocket = (ticker) => {
	const message = {
		"action": "SubAdd",
		"subs": [`5~CCCAGG~${ticker}~USD`]
	}

	sendTickerOnWS(message)
}

//! сообщение отписки от тикера

const unUpdateTickerOnWebSocket = (ticker) => {
	const message = {
		"action": "SubRemove",
		"subs": [`5~CCCAGG~${ticker}~USD`]
	}

	sendTickerOnWS(message)
}



//! Подписка на обновление

export const subsribeToUpdate = (ticker, cb) => {
	const subsribers = subcribedTickers.get(ticker) ?? []
	subcribedTickers.set(ticker, [...subsribers, cb])
	updateTickerOnWebSocket(ticker)
}

//! Отписка от обновления

export const unsubsribeToUpdate = (ticker) => {
	subcribedTickers.delete(ticker)
	unUpdateTickerOnWebSocket(ticker)
}


























//autoComleate

export const autoCompleateLoader = async () => {
	const url =
		"https://min-api.cryptocompare.com/data/all/coinlist?summary=true";

	const response = await fetch(url);
	const data = await response.json();

	const list = []

	for (let [key, value] of Object.entries(data.Data)) {
		list.push(value);
	}

	return list
} 