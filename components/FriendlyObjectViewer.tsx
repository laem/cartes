import { utils } from 'publicodes'
import { capitalise0 } from './utils/utils'
import Link from 'next/link'

const FriendlyObjectViewer = ({
	data,
	level = 0,
	context,
	options = { capitalise0: true },
}) => {
	if (data == null) return null
	const capitaliseOrNot = options.capitalise0 ? capitalise0 : (s) => s
	if (typeof data === 'string') {
		try {
			if (!context) return <span>{capitaliseOrNot(data)}</span>
			const isRule = utils.disambiguateReference(
				context.rules,
				context.dottedName,
				data
			)

			return (
				<Link to={`/documentation/${utils.encodeRuleName(isRule)}`}>
					{capitaliseOrNot(data)}
				</Link>
			)
		} catch (e) {
			console.log(e)
			return <span>{capitaliseOrNot(data)}</span>
		}
	}
	if (typeof data === 'number') return <span>{data}</span>

	const isArray = Object.keys(data).every((key) => Number.isInteger(+key))
	const Level = isArray ? (
		<ol
			css={`
				padding-left: 2rem;
				list-style-type: circle;
			`}
		>
			{Object.entries(data).map(([key, value]) => (
				<li key={key}>
					<FriendlyObjectViewer
						data={value}
						level={level + 1}
						context={context}
						options={options}
					/>
				</li>
			))}
		</ol>
	) : (
		<ul
			css={`
				list-style-type: none;
				margin-bottom: 0;
			`}
		>
			{Object.entries(data).map(([key, value]) =>
				typeof value === 'string' || typeof value === 'number' ? (
					<li key={key}>
						<span>{capitaliseOrNot(key)}:</span>
						<span
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
								options={options}
							/>
						</span>
					</li>
				) : (
					<li key={key}>
						<div>{capitaliseOrNot(key)}:</div>
						<div
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
								options={options}
							/>
						</div>
					</li>
				)
			)}
		</ul>
	)

	if (level === 0)
		return (
			<div
				css={`
					border: 1px solid var(--darkColor);
					padding: 0.2rem 1rem;
					border-radius: 0.2rem;
				`}
			>
				{Level}
			</div>
		)
	return Level
}

export default FriendlyObjectViewer
