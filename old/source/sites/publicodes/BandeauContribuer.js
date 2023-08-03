import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div css=" text-align: center; margin: .6rem 0">
			Une idée, un problème ? {emoji('📮')}{' '}
			<a href="https://github.com/laem/futureco-data/issues">
				Faites-nous un retour !
			</a>
		</div>
	)
}
