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
	if (!users) return null
	const values = Object.values(elements)
	const mean = computeMean(values),
		humanMean = computeHumanMean(values)

	return (
		<div>
			<div css="text-align: center">Moyenne du groupe : {humanMean}</div>
			<div css="text-align: center">Moyenne française : 11 tonnes</div>
			{!isNaN(mean) && (
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
					<li key="legendLeft">{Math.round(Math.min(...values) / 1000)}</li>
					{Object.entries(elements).map(([usernameI, value]) => (
						<li
							key={usernameI}
							css={`
								height: 100%;
								width: 10px;
								left: ${(value / Math.max(...values)) * 100 * 0.8}%;
								background: ${users.find((u) => u.name === usernameI)?.color ||
								'black'};
								opacity: 0.2;
							`}
						></li>
					))}
					<li key="legendRight">{Math.round(Math.max(...values) / 1000)}</li>
				</div>
			)}
		</div>
	)
}
