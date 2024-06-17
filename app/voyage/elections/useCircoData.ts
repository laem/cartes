import { useEffect, useState } from 'react'

export default function (id) {
	const [data, setData] = useState(null)

	useEffect(() => {
		if (!id) return
		const fetchData = async () => {
			try {
				setData(null)
				const url = `https://raw.githubusercontent.com/f3reg/lg2024/main/legislatives/2024/candidats/saisie/t1_circo_${id}.json`

				const request = await fetch(url)
				const json = await request.json()

				setData(shuffleArray(json))
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
