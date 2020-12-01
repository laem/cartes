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
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<h1>Nos fiches complètes</h1>
			<ul
				css={`
					list-style-type: none;
					display: flex;
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
									align-items: center;
									justify-content: center;
									flex-wrap: wrap;
									width: 12rem;
									height: 10rem;
								`}
							>
								{emoji(icons || '🎯🎯')}
								<h2>{title}</h2>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
