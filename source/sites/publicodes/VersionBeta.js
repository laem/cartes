import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default () => {
	const location = useLocation()

	if ([process.env.URL_PATH, '/', '/actions'].includes(location.pathname))
		return null
	return (
		<div css="background: yellow; text-align: center; color: black; ">
			Attention, version{' '}
			<span
				css={`
					display: inline-block;
					background: rgb(131, 167, 201) none repeat scroll 0% 0%;
					padding: 0px 0.3rem;
					text-align: center;
					font-size: 80%;
					color: white;
					border-radius: 0.6rem;
					font-weight: 900;
					transform: rotate(15deg);
					animation-duration: 2s;
					animation-name: slidein;
					margin: 0 0.4rem;

					@keyframes slidein {
						from {
							font-size: 150%;
							transform: rotate(0deg);
						}

						to {
							font-size: 80%;
							transform: rotate(15deg);
						}
					}
				`}
			>
				beta
			</span>
			<Link to="/contribuer">faites-nous vos retours !</Link>
		</div>
	)
}
