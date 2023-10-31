'use client'
import Image from 'next/image'

import css from './css/convertToJs'

const ADEMELogoURL =
	'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg'

export default function BaseCarboneReference({ rule }) {
	const ref = rule.références,
		baseCarbone = ref?.find((el) => el.includes('bilans-ges.ademe.fr'))
	if (!baseCarbone) return null
	return (
		<div
			style={css`
				margin: 1rem 0;
			`}
		>
			<div css="img {vertical-align: middle}">
				Une donnée{' '}
				<Image
					style={css`
						margin-right: 0.2rem;
						height: 2rem;
						width: auto;
					`}
					src={ADEMELogoURL}
					width="30"
					height="30"
					alt="Logo de la base carbone de l'ADEME"
				/>
				<a href="https://bilans-ges.ademe.fr"> base carbone ADEME</a>
			</div>
		</div>
	)
}
