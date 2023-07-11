import Emoji from '../../components/Emoji'

const units = ['€', 'ⵛ', 'kWh']
const table = units.map((u) => [u, Math.random() > 0.5])

export default () => (
	<div className="ui__ container" css="padding: 1rem !important">
		<h1>Faut-il que je renouvelle mon lave-linge ?</h1>
		<ul
			css={`
				list-style-type: none;
			`}
		>
			{table.map(([unit, response]) => (
				<li
					key={unit}
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						span {
							width: 4rem;
							display: inline-block;
							margin: 1rem;
							text-align: center;
						}
						span:first-child {
							font-size: 200%;
						}
						span:last-child {
							border-radius: 0.3rem;
							height: 2rem;
							line-height: 2rem;
							font-weight: bold;
						}
					`}
				>
					<span>{unit === 'kWh' ? <small>{unit}</small> : unit}</span>
					<span
						css={`
							background: ${response ? 'green' : 'red'};
						`}
					>
						{response ? 'Oui' : 'Non'}
					</span>
				</li>
			))}
		</ul>
		<h2 css="margin-top: 2rem">
			Personnaliser la réponse
			<Emoji e="🎯" />
		</h2>
		<div>
			<strong>[question 1 / 8]</strong>
			<h3>Quelle est la consommation d'énergie de votre lave-linge actuel ?</h3>
			<input type="text" placeholder="152 kWh" />{' '}
			<label>pour 100 lavages</label>
		</div>
		<h2 css="margin-top: 5rem">
			Explications <Emoji e="⬇️" />
		</h2>
		<p>Ici on vous explique les hypothèses de calcul</p>
	</div>
)
