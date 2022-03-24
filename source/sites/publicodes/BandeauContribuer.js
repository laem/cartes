import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div css=" text-align: center; color: black; margin: .6rem 0">
			Une idée, un problème ? {emoji('📮')}{' '}
			<Link to={'/contribuer?fromLocation=' + window.location}>
				Faites-nous un retour !
			</Link>
		</div>
	)
}
