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
}) => {
	const { dottedName, title, nodeValue } = evaluation
	const { icônes, formule } = rule
	return (
		<div
			key={dottedName}
			css={`
				font-size: 120%;
				padding: 0;
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
			<div
				id="shareImage"
				css={`
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					width: 100%;
					overflow: hidden;
					> *:first-child {
						z-index: 0;
					}
					> * {
						z-index: 1;
					}
				`}
			>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Marité.jpg/400px-Marité.jpg"
					css={`
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						opacity: 0.8;
						left: 0;
						width: 100%;
						height: auto;
						object-fit: cover;
					`}
				/>
				<div css="width: 100%; img { font-size: 150%}}">
					{icônes && <Emoji e={icônes} />}
				</div>
				<h1
					css={`
						width: 100%;
						font-size: 100%;
						color: var(--darkerColor);
						margin: 0;
						margin-bottom: 1rem;
						width: 80%;
						background: white;
						border-radius: 0.15rem;
						line-height: 1.4rem;
						--shadow-color: 0deg 0% 63%;
						--shadow-elevation-medium: 0.3px 0.5px 0.7px
								hsl(var(--shadow-color) / 0.36),
							0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
							2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
							5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
						box-shadow: var(--shadow-elevation-medium);
					`}
				>
					{title}
				</h1>
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
