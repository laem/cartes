'use client'
import Image from 'next/image'

import css from './css/convertToJs'

const ADEMELogoURL =
	'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg'

export default function BaseCarboneReference({ rule }) {
	const ref = rule.références
	const baseCarbone =
		ref &&
		Array.isArray(ref) &&
		ref.find((el) => el.includes('bilans-ges.ademe.fr'))
	if (!baseCarbone) return null
	return (
		<div
			style={css`
				margin: 1rem 0;
			`}
		>
			<div
				css={`
					img {
						vertical-align: middle;
						margin: 0 1rem;
						height: 2rem;
						width: auto;
					}
					display: flex;
					align-items: center;
					justify-content: end;
				`}
			>
				Une donnée{' '}
				<Image
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
