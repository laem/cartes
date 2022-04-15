import emoji from 'react-easy-emoji'
import HumanCarbonImpact, {
	ProgressCircle,
} from '../sites/publicodes/HumanCarbonImpact'
import Emoji from './Emoji'

export default ({ dottedName, formule, title, icônes, nodeValue }) => {
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
				box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
					0 1px 2px rgba(41, 117, 209, 0.24);
				transition: box-shadow 0.2s;
				:hover {
					opacity: 1 !important;
					box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2),
						0px 4px 5px 0px rgba(41, 117, 209, 0.14),
						0px 1px 10px 0px rgba(41, 117, 209, 0.12);
				}
			`}
		>
			<ProgressCircle />
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
				<h1 css="width: 100%; font-size: 120%; color: var(--darkerColor); margin: 0; margin-bottom: 1rem">
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
						}}
					/>
				</div>
			</>
		</div>
	)
}
