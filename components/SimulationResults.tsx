import HumanCarbonImpact, { ProgressCircle } from 'Components/HumanCarbonImpact'
import Emoji from './Emoji'

const SimulationResults = ({
	engine,
	ResultsBlock,
	searchParams,
	objectives,
	evaluation,
	rule,
	opacity,
	hideResults,
	SubTitle,
}) => {
	const { dottedName, title, nodeValue } = evaluation
	const { icônes, formule } = rule

	return (
		<div
			key={dottedName}
			css={`
				font-size: 120%;
				padding: 1rem 0 0;
				width: 18rem;
				min-height: 7em;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: middle;
				text-align: center;
				flex-wrap: wrap;
				line-height: 1.2em;
				${formule != null ? '' : 'filter: grayscale(70%); opacity: 0.6;'}
				background-color: var(--lightestColor);
				color: var(--darkColor);
				margin: 1rem auto;
				border-radius: 0.3rem;
			`}
		>
			<ProgressCircle {...{ engine, searchParams, objectives }} />
			<div
				id="shareImage"
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					width: 100%;
					padding-bottom: 0.6rem;
				`}
			>
				<div css="width: 100%; img { font-size: 150%}}">
					{icônes && <Emoji e={icônes} />}
				</div>
				<h1
					css={`
						width: 100%;
						font-size: 120%;
						color: var(--darkerColor);
						margin: 0;
						margin-bottom: 0.4rem;
						line-height: 2rem;
					`}
				>
					{title}
				</h1>
				{SubTitle && <SubTitle />}
			</div>
			<>
				<div
					css={`
						border-bottom-left-radius: 0.3rem;
						border-bottom-right-radius: 0.3rem;
						bottom: 0;
						left: 0;
						width: 100%;
						background: var(--color);
						color: white;
						font-size: 80%;
						position: sticky;
						top: 0px;
						z-index: 10;
						opacity: ${opacity};
						display: ${hideResults ? 'none' : 'block'};
					`}
				>
					{ResultsBlock ? (
						<ResultsBlock />
					) : (
						<HumanCarbonImpact
							{...{
								nodeValue,
								formule,
								dottedName,
								objectives,
								searchParams,
							}}
							engine={engine}
						/>
					)}
				</div>
			</>
		</div>
	)
}

export default SimulationResults
