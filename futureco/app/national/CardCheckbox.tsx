'use client'
import Checkbox from '@/components/ui/Checkbox'
import useSound from 'use-sound'
import Link from 'next/link'
import { utils } from 'publicodes'

const removeNullsFromObject = (obj) =>
	Object.fromEntries(Object.entries(obj).filter((el) => el[1]))

export default function CardCheckbox({
	children,
	isChecked,
	formule,
	state,
	titre,
}) {
	const [playActive] = useSound('/sounds/pop-down.mp3', {
		volume: 0.25,
	})
	const [playOn] = useSound('/sounds/pop-up-on.mp3', { volume: 0.25 })
	const [playOff] = useSound('/sounds/pop-up-off.mp3', {
		volume: 0.25,
	})
	const encodedTitre = utils.encodeRuleName(titre)

	const newQuery = removeNullsFromObject({
		...state,
		[encodedTitre]: !state[encodedTitre],
	})

	return (
		<div
			onMouseDown={() => playActive()}
			onMouseUp={() => {
				isChecked ? playOff() : playOn()
			}}
			onClick={() => {
				playOn()
			}}
		>
			<Link
				href={{
					pathname: '/national',
					query: newQuery,
				}}
				prefetch={false}
				scroll={false}
			>
				<Checkbox
					checked={isChecked || false}
					title="Cocher pour activer cette mesure de planification"
				/>
			</Link>
		</div>
	)
}
