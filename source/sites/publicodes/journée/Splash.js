import React from 'react'

export default ({ action }) => {
	const date = new Date(),
		today = date.toLocaleDateString('fr', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	return (
		<div
			css={`
				small {
					font-size: 100%;
					font-style: italic;
				}
				em {
					background: #78e08f;
					font-style: normal;
					padding: 0 0.2rem;
				}
				h1 {
					margin-top: 0.6rem;
					margin-bottom: 3rem;
				}
			`}
		>
			<small>{today}</small>
			<h1>
				As-tu été <em>écolo</em> ?
			</h1>
			<button className="ui__ button plain" onClick={action}>
				Faire le test
			</button>
		</div>
	)
}
