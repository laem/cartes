import { ScrollToTop } from 'Components/utils/Scroll'
import { encodeRuleName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'

export default () => {
	const rules = useSelector(flatRulesSelector)
	const plus = rules.filter((r) => r.plus)

	return (
		<div className="ui__ container">
			<ScrollToTop />
			<h1>
				Nos fiches complètes
				<img src="https://img.shields.io/badge/-beta-blue" />
			</h1>
			<p>
				<em>
					Plongez-vous dans cette documentation qui détaille chaque action.
				</em>
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
