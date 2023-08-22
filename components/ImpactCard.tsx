'use client'
import scenarios from '@/app/scenarios/scenarios.yaml'
import Emoji from 'Components/Emoji'
import animate from 'Components/ui/animate'
import Link from 'next/link'
import { utils } from 'publicodes'
import { useSelector } from 'react-redux'
import BudgetBar, { BudgetBarStyle } from './BudgetBar'
import * as chrono from './chrono'
import { humanWeight } from './HumanWeight'

const { encodeRuleName } = utils

const limitPerPeriod = (scenario) =>
	Object.fromEntries(
		Object.entries({
			...chrono,
			négligeable: 0,
		}).map(([key, v]) => [
			key,
			v * scenarios[scenario]['crédit carbone par personne'] * 1000,
		])
	)

const findPeriod = (scenario, nodeValue) =>
	Object.entries(limitPerPeriod(scenario))
		.sort(([, a], [, b]) => b - a)
		.find(([, limit]) => limit <= Math.abs(nodeValue))

const humanCarbonImpactData = (scenario, nodeValue) => {
	const [closestPeriod, closestPeriodValue] = findPeriod(scenario, nodeValue),
		factor = Math.round(nodeValue / closestPeriodValue),
		closestPeriodLabel = closestPeriod.startsWith('demi')
			? closestPeriod.replace('demi', 'demi-')
			: closestPeriod

	return { closestPeriod, closestPeriodValue, closestPeriodLabel, factor }
}

const ImpactCard = ({
	nodeValue,
	dottedName,
	title,
	exampleName,
	questionEco,
	unit: ruleUnit,
}) => {
	const scenario = useSelector((state) => state.scenario)
	const budget = scenarios[scenario]['crédit carbone par personne'] * 1000

	if (nodeValue == null) return
	const [value, unit] = humanWeight(nodeValue)
	const { closestPeriodLabel, closestPeriod, factor } = humanCarbonImpactData(
		scenario,
		nodeValue
	)

	return (
		<animate.appear>
			<div
				css={`
					border-radius: 6px;
					background: var(--color);
					padding: 0.4em;
					margin: 0 auto;
					color: var(--textColor);
					max-width: 13rem;
				`}
			>
				{!questionEco && closestPeriodLabel === 'négligeable' ? (
					<span>
						Impact négligeable <Emoji e={'😎'} />
					</span>
				) : (
					<>
						<div
							css={`
								padding: 0.6rem 1rem 0.25rem;
								@media (max-width: 1000px) {
									padding: 0.6rem 0.3rem 0.25rem;
								}
								margin-bottom: 0.25rem;
								color: var(--textColor);
								display: flex;
								flex-direction: column;
								justify-content: space-evenly;
								img[alt*='↔'] {
									filter: invert(1);
									margin: 0 0.4rem;
									width: 1.1rem;
								}
							`}
						>
							{exampleName && <div>{<Emoji e={exampleName} hasText />}</div>}
							{questionEco ? (
								<div>
									<h2
										css={`
											white-space: initial;
											line-height: 1rem;
											font-size: 110%;
											margin: 0.4rem 0;
											margin-left: -1rem;
											text-align: center;
											width: calc(100% + 2rem);
										`}
									>
										{nodeValue > 0
											? 'Vous économisez'
											: title.includes('oût')
											? 'Ça vous coûte'
											: title.includes('nergie')
											? 'Vous consommez'
											: 'Vous émettez'}
									</h2>
									<Link
										href={'/documentation/' + encodeRuleName(dottedName)}
										css="color: inherit; text-decoration: none"
									>
										<BudgetBarStyle color={nodeValue < 0 ? 'ee5253' : '1dd1a1'}>
											{nodeValue ? Math.round(Math.abs(nodeValue)) : '?'}{' '}
											{ruleUnit.numerators}
										</BudgetBarStyle>
									</Link>
									<em>
										{title.includes('oût') ? 'sur 10 ans' : 'chaque année'}
									</em>
								</div>
							) : [
									'transport . avion . impact',
									'transport . ferry . empreinte du voyage',
							  ].includes(dottedName) ? (
								<BudgetBar
									{...{
										noExample: !exampleName,
										budget,
										nodeValue,
										exampleName,
										factor,
										closestPeriodLabel,
										closestPeriod,
									}}
								/>
							) : (
								<div
									css={`
										display: flex;
										justify-content: center;
										align-items: center;
										font-size: ${exampleName ? '140%' : '220%'};
										img {
											width: 1.6rem;
											margin-left: 0.4rem;
											vertical-align: bottom;
										}
									`}
								>
									<div>
										{factor +
											' ' +
											closestPeriodLabel +
											(closestPeriod[closestPeriod.length - 1] !== 's' &&
											Math.abs(factor) > 1
												? 's'
												: '')}
									</div>
									<Link css="" href="/credit-climat-personnel">
										<img src={'/yellow-info.svg'} width="10px" height="10px" />
									</Link>
								</div>
							)}
							<Link
								css="color: inherit; text-decoration: none"
								href={'/documentation/' + encodeRuleName(dottedName)}
							>
								<p
									css={`
										font-size: 100%;
										margin: 0.3rem 0 0;
										font-style: italic;
										border-radius: 0.4rem;
									`}
								>
									{questionEco ? null : (
										<span>
											{value} {unit} CO₂e
										</span>
									)}
								</p>
							</Link>
						</div>
					</>
				)}
			</div>
		</animate.appear>
	)
}

export default ImpactCard
