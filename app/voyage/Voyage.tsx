'use client'

import VoyageInput from '@/components/conversation/VoyageInput'
import { useState } from 'react'

export default () => {
	const [value, setValue] = useState(null)
	return (
		<div>
			Distance : {JSON.stringify(value)} km
			<VoyageInput onChange={(v) => setValue(v)} db="osm" />
		</div>
	)
}
