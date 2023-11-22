// Inspired by https://github.com/zbycz/osmapp/blob/master/src/services/helpers.ts#L107

export default function Address({ tags }) {
	const {
		'addr:place': place,
		'addr:street': street,
		'addr:housenumber': houseNumber,
		'addr:city': city,
		'addr:state': state,
		'addr:postcode': postcode,
	} = tags

	return (
		<address
			css={`
				line-height: 1.4rem;
				font-size: 90%;
				font-style: normal;
			`}
		>
			{houseNumber} {street}
			{postcode || city || state ? ', ' : ''} {postcode} {city} {state}
		</address>
	)
}
