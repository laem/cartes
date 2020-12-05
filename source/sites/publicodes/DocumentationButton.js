import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

const DocumentationButton = (props) => {
	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					margin-right: 0.4rem !important;
				}
			`}
		>
			{emoji('📄')}
			<Link {...props} to={'/documentation'}>
				Comprendre nos calculs
			</Link>
		</div>
	)
}

export default DocumentationButton
