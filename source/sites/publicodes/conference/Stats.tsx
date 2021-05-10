import Progress from '../../../components/ui/Progress'
import CategoryStats from './CategoryStats'

export const computeMean = (simulationArray) =>
	simulationArray &&
	simulationArray
		.filter((el) => el !== null)
		.reduce((memo, next) => memo + next || 0, 0) / simulationArray.length

export const computeHumanMean = (simulationArray) => {
	const result = computeMean(simulationArray)

	return result
		? Math.round(result / 100) / 10 + ' tonnes'
		: 'résultats en attente'
}

const testResults = [12, 25, 22, 8, 4, 7, 9, 8, 11, 10]

export default ({ elements, users, username }) => {
	if (!users) return null
	const values = Object.values(elements).map((el) => el.bilan)
	const mean = computeMean(values),
		humanMean = computeHumanMean(values)

	const progressList = Object.values(elements).map((el) => el.progress),
		meanProgress = computeMean(progressList)

	console.log('PORGRESSLIST', progressList.join('  -  '))

	if (isNaN(mean)) return null

	const categories = reduceCategories(
			Object.values(elements).map((el) => el.byCategory)
		),
		maxCategory = Object.values(categories).reduce(
			(memo, next) => Math.max(memo, ...next),
			0
		),
		maxValue = Math.max(...values),
		minValue = Math.min(...values)

	console.log('CAR', categories)

	return (
		<div>
			<div css=" text-align: center">
				<p>Avancement du groupe</p>
				<Progress progress={meanProgress} />
			</div>
			<div css="margin: 1.6rem 0">
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
							left: 2%;
						}
						li:last-child {
							right: 2%;
						}
					`}
				>
					<li key="legendLeft">{Math.round(Math.min(...values) / 1000)}</li>
					{Object.entries(elements).map(([usernameI, { bilan: value }]) => (
						<li
							key={usernameI}
							css={`
								height: 100%;
								width: 10px;
								left: ${((value - minValue) / (maxValue - minValue)) * 80 + 8}%;
								background: ${users.find((u) => u.name === usernameI)?.color ||
								'black'};
								opacity: 0.5;
							`}
						></li>
					))}
					<li key="legendRight">{Math.round(Math.max(...values) / 1000)}</li>
				</div>
			</div>
			<CategoryStats {...{ categories, maxCategory }} />
		</div>
	)
}

const reduceCategories = (list) =>
	list.reduce(
		(memo, next) => {
			return next.reduce(
				(countByCategory, nextCategory) => ({
					...countByCategory,
					[nextCategory.name]: [
						...(countByCategory[nextCategory.name] || []),
						nextCategory.nodeValue,
					],
				}),
				memo
			)
		},

		{}
	)
