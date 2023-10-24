import personSitting from '@/public/person-sitting.svg'
import Image from 'next/image'
import { PassengersButton } from './ExempleTableUI'

const limit = 5
export default function Passengers({ passengers, setPassengers }) {
	return (
		<div>
			<PassengersButton
				title={`Pour ${passengers} voyageurs. Cliquez pour augmenter !`}
				onClick={() => setPassengers(passengers >= limit ? 1 : passengers + 1)}
			>
				{passengers}{' '}
				{[...Array(passengers).keys()].map((i) => (
					<PersonImage key={i} />
				))}
			</PassengersButton>
		</div>
	)
}

export const PersonImage = () => (
	<Image src={personSitting} alt="Une personne assise dans la voiture" />
)
