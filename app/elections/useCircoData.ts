import { useEffect, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'

export default function (id) {
	const [data, setData] = useState(null)

	useEffect(() => {
		if (!id) return
		const fetchData = async () => {
			try {
				setData(null)
				const url = `${gtfsServerUrl}/elections-legislatives-2024/${id}`

				const request = await fetch(url)
				const json = await request.json()

				setData(json)
			} catch (e) {
				setData('Error')
			}
		}

		fetchData()
	}, [id, setData])
	return data
}

function shuffleArray(array) {
	let shuffled = array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)

	return shuffled
}
