import icons from '@/app/voyage/icons/icons.json'

const urlBase = `https://cdn.jsdelivr.net/gh/osmandapp/OsmAnd-resources/icons/svg/`

export default function getIcons(tags) {
	return Object.entries(tags)
		.map(([k, v]) => icons.find(([key]) => key === k + '_' + v || key === v))
		.filter(Boolean)
		.map((el) => urlBase + el[1])
}
