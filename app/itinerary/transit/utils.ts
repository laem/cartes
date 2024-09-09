import { stamp } from './motisRequest'

export const filterNextConnections = (connections, date) =>
	connections.filter((connection) => connectionStart(connection) > stamp(date))

export const connectionStart = (connection) =>
	connection.stops[0].departure.time

export const connectionEnd = (connection) =>
	connection.stops.slice(-1)[0].arrival.time

export const humanDuration = (seconds) => {
	if (seconds < 60) {
		const text = `${seconds} secondes`

		return { interval: `toutes les ${seconds} secondes`, single: text }
	}
	const minutes = seconds / 60
	if (minutes > 15 - 2 && minutes < 15 + 2)
		return { interval: `tous les quarts d'heure`, single: `Un quart d'heure` }
	if (minutes > 30 - 4 && minutes < 30 + 4)
		return { interval: `toutes les demi-heures`, single: `Une demi-heure` }
	if (minutes > 45 - 4 && minutes < 45 + 4)
		return {
			interval: `tous les trois quarts d'heure`,
			single: `trois quarts d'heure`,
		}
	if (minutes > 60 - 4 && minutes < 60 + 4)
		return {
			interval: `toutes les heures`,
			single: `une heure`,
		}

	if (minutes < 60) {
		const text = `${Math.round(minutes)} min`
		return { interval: `toutes les ${text}`, single: text }
	}
	const hours = minutes / 60

	if (hours < 5) {
		const rest = Math.round(minutes - hours * 60)

		const text = `${Math.floor(hours)} h${rest > 0 ? ` ${rest} min` : ''}`
		return { interval: `Toutes les ${text}`, single: text }
	}
	const text = `${Math.round(hours)} heures`
	return { interval: `toutes les ${text}`, single: text }
}
export const dateFromMotis = (timestamp) => new Date(timestamp * 1000)
export const formatMotis = (timestamp) =>
	startDateFormatter.format(dateFromMotis(timestamp))

export const startDateFormatter = Intl.DateTimeFormat('fr-FR', {
	hour: 'numeric',
	minute: 'numeric',
})
