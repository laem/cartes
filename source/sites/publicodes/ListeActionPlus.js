import React from 'react'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { encodeRuleName } from 'Engine/rules'

export default () => {
	const rules = useSelector(flatRulesSelector)
	const plus = rules.filter((r) => r.plus)

	return (
		<div className="ui__ container">
			<h1>Nos fiches complètes</h1>
			<p>
				<em>En cours de construction</em>
			</p>
			<ul
				css={`
					list-style-type: none;
					display: flex;
					flex-wrap: wrap;
					li {
						margin: 0.6rem;
						text-align: center;
					}
					li > a {
						text-decoration: none;
					}
				`}
			>
				{plus.map(({ dottedName, icons, title }) => (
					<li key={dottedName}>
						<Link to={'/actions/plus/' + encodeRuleName(dottedName)}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									justify-content: space-evenly;
									width: 12rem;
									height: 10rem;
									img {
										font-size: 150%;
									}
								`}
							>
								<div>{emoji(icons || '🎯')}</div>
								<div>{title}</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
