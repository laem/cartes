import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import emoji from 'react-easy-emoji'

export default () => {
	const location = useLocation()

	const pathHas = (fragment) => location.pathname.includes(fragment)

	if (!(pathHas('/documentation') || pathHas('/simulateur'))) return null
	return (
		<div css=" text-align: center; color: black; ">
			Une idée, un problème ? {emoji('📮')}{' '}
			<Link to="/contribuer">Faites-nous un retour !</Link>
		</div>
	)
}
