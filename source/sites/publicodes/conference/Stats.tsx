export const computeMean = (simulationArray) =>
	simulationArray &&
	simulationArray
		.filter((el) => el !== null)
		.reduce((memo, next) => memo + next || 0, 0) / simulationArray.length

export const computeHumanMean = (simulationArray) => {
	const result = computeMean(simulationArray)
	console.log('RES', result)

	return result
		? Math.round(result / 100) / 10 + ' tonnes'
		: 'résultats en attente'
}

const testResults = [12, 25, 22, 8, 4, 7, 9, 8, 11, 10]

export default ({ elements, users, username }) => {
	const mean = computeMean(elements),
		humanMean = computeHumanMean(elements)
	console.log(elements, users, username, mean, humanMean)

	return (
		<div>
			<div css="text-align: center">Moyenne du groupe : {humanMean}</div>
			<div css="text-align: center">Moyenne française : 11 tonnes</div>
			<div
				css={`
					width: 90%;
					position: relative;
					margin: 0 auto;
					border: 2px solid black;
					height: 2rem;
					list-style-type: none;
					li {
						position: absolute;
					}
					li:first-child {
						left: 5%;
					}
					li:last-child {
						right: 5%;
					}
				`}
			>
				<li key="legendLeft">{Math.round(Math.min(...elements) / 1000)}</li>
				{elements.map((el) => (
					<li
						key={el}
						css={`
							height: 100%;
							width: 10px;
							left: ${(el / Math.max(...elements)) * 100 * 0.8}%;
							background: black;
							opacity: 0.2;
						`}
					></li>
				))}
				<li key="legendRight">{Math.round(Math.max(...elements) / 1000)}</li>
			</div>
		</div>
	)
}
