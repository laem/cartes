import emoji from 'react-easy-emoji'
import HumanCarbonImpact, { ProgressCircle } from 'Components/HumanCarbonImpact'
import Emoji from './Emoji'

const SimulationResults = ({
	dottedName,
	formule,
	title,
	icônes,
	nodeValue,
	engine,
}) => {
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
			<ProgressCircle engine={engine} />
			<div
				id="shareImage"
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					width: 100%;
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
						margin-bottom: 1rem;
						line-height: 2rem;
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
					`}
				>
					<HumanCarbonImpact
						{...{
							nodeValue,
							formule,
							dottedName,
							engine,
						}}
					/>
				</div>
			</>
		</div>
	)
}

export default SimulationResults
