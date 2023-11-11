export const dateCool = (date) =>
	new Date(date).toLocaleString('fr-FR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
