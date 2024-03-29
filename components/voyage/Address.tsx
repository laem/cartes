// Inspired by https://github.com/zbycz/osmapp/blob/master/src/services/helpers.ts#L107

export const addressKeys = [
	'addr:place',
	'addr:street',
	'addr:housenumber',
	'addr:city',
	'addr:state',
	'addr:postcode',
	'contact:city',
	'contact:housenumber',
	'contact:postcode',
	'contact:street',
]

export default function Address({ tags, noPrefix }) {
	return (
		<address
			css={`
				line-height: 1.4rem;
				font-size: 90%;
				font-style: normal;
			`}
		>
			{buildAddress(tags, noPrefix)}
		</address>
	)
}

export const buildAddress = (t: object, noPrefix = false) => {
	const g = (key) => {
		const value = noPrefix ? t[key] : t[`addr:` + key] || t['contact:' + key]
		return value || ''
	}

	const address = `${g('housenumber')} ${g('street')} ${
		g('postcode') || g('city') || g('state') ? ', ' : ''
	} ${g('postcode')} ${g('city')} ${g('state')}
`
	if (address.trim() === '') return null
	return address
}

export const AddressDisc = ({ t, noPrefix = false }) => {
	const g = (key) => {
		const value = noPrefix ? t[key] : t[`addr:` + key] || t['contact:' + key]
		const shorterValue = [
			['avenue', 'av.'],
			['boulevard', 'bd.'],
			['rue', 'r.'],
			['carrefour', 'car.'],
		].reduce((memo, [from, to]) => memo.replace(from, to), value.toLowerCase())
		return shorterValue || ''
	}
	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0.6rem 0;
				justify-content: space-between;
				width: 4rem;
				height: 4rem;
				border-radius: 4rem;
				border: 1px solid var(--color);
				font-size: 80%;
				overflow: hidden;
				> span,
				> strong {
					text-align: center;
					line-height: 0.8rem;
					max-width: 4rem;
				}
			`}
		>
			<strong>{g('housenumber')}</strong>
			<span>{g('street')}</span>
		</div>
	)
}
