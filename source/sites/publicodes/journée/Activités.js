import React from 'react'
import Activité from './Activité'

export default ({ display, items, setSearching, quota }) => (
	<ul
		css={`
			display: ${display ? 'flex' : 'none'};
			flex-direction: column;
			justify-content: flex-start;
			height: 100vh;
			margin: 0;
			padding: 0;
			> li {
				line-height: 3rem;
				padding-left: 1rem;
				width: 100%;
				list-style-type: none;
			}
			img {
				font-size: 180%;
			}
		`}
	>
		{items.map(([text, icon, weight], i) => (
			<Activité key={text} {...{ weight, quota, icon, i }} />
		))}
		<button
			className="ui__ card"
			onClick={setSearching}
			css={`
				font-size: 300%;
				position: absolute;
				bottom: 1rem;
				right: 1rem;
				padding: 0;
				border-radius: 10rem !important;
				width: 7rem;
				height: 7rem;
				background: var(--colour);
				color: var(--textColour);
				display: flex;
				align-items: center;
				justify-content: center;
			`}
		>
			+
		</button>
	</ul>
)
