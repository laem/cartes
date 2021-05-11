import emoji from 'react-easy-emoji'
import Progress from '../../../components/ui/Progress'
import { humanWeight } from '../HumanWeight'
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

export default ({ elements, users, username }) => {
	if (!users) return null
	const values = Object.values(elements).map((el) => el.bilan)
	const mean = computeMean(values),
		humanMean = computeHumanMean(values)

	const progressList = Object.values(elements).map((el) => el.progress),
		meanProgress = computeMean(progressList)

	if (isNaN(mean)) return null

	const categories = reduceCategories(
			Object.values(elements).map((el) => el.byCategory)
		),
		maxCategory = Object.values(categories).reduce(
			(memo, next) => Math.max(memo, ...next),
			0
		)

	const maxValue = Math.max(...values),
		minValue = 2000, // 2 tonnes, the ultimate objective
		max = humanWeight(maxValue, true).join(' '),
		min = humanWeight(minValue, true).join(' ')

	console.log('ALL', elements, users, username)

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
						width: 100%;
						position: relative;
						margin: 0 auto;
						border: 2px solid black;
						height: 2rem;
						list-style-type: none;
						li {
							position: absolute;
						}
					`}
				>
					{Object.entries(elements).map(([usernameI, { bilan: value }]) => (
						<li
							key={usernameI}
							css={`
								height: 100%;
								width: 10px;
								margin-left: -10px;
								left: ${((value - minValue) / (maxValue - minValue)) * 100}%;
								background: ${users.find((u) => u.name === usernameI)?.color ||
								'black'};
								opacity: 0.5;
							`}
						></li>
					))}
				</div>

				<div css="display: flex; justify-content: space-between; width: 100%">
					<small key="legendLeft">
						{emoji('🎯 ')}
						{min}
					</small>
					<small key="legendRight">{max}</small>
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
