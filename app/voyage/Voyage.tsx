'use client'
import Engine from 'publicodes'
import { createContext, useState } from 'react'
import rules from './data/rules.ts'

import VoyageInput from '@/components/conversation/VoyageInput'
import Questions from './Questions'

const engine = new Engine(rules)
export const SituationContext = createContext({})

export default function Voyage() {
	const [value, setValue] = useState(null)
	const [situation, setSituation] = useState({})
	return (
		<div>
			{false && (
				<div>
					Distance : {JSON.stringify(value)} km
					<VoyageInput onChange={(v) => setValue(v)} db="osm" />
				</div>
			)}
			<SituationContext.Provider value={[situation, setSituation]}>
				<Questions
					engine={engine}
					target="trajet voiture . coût trajet par personne"
				/>
			</SituationContext.Provider>
		</div>
	)
}
