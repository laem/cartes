export const ogImageURL = (dottedName, icons, searchParams) =>
	`/cout-voiture/og?dottedName=${dottedName}&title=${`Coût du trajet en voiture`}&emojis=${icons}&${new URLSearchParams(
		searchParams
	).toString()}`
