'use client'
import Checkbox from '@/components/ui/Checkbox'
import useSound from 'use-sound'

export default function CardCheckbox({
	children,
	isChecked,
	formule,
	setState,
	titre,
}) {
	const [playActive] = useSound('/sounds/pop-down.mp3', {
		volume: 0.25,
	})
	const [playOn] = useSound('/sounds/pop-up-on.mp3', { volume: 0.25 })
	const [playOff] = useSound('/sounds/pop-up-off.mp3', {
		volume: 0.25,
	})

	return (
		<div
			onMouseDown={() => playActive()}
			onMouseUp={() => {
				isChecked ? playOff() : playOn()
			}}
			onClick={() => {
				playOn()

				setState((state) => ({ ...state, [titre]: !state[titre] }))
			}}
		>
			<Checkbox
				checked={isChecked || false}
				title="Cocher pour activer cette mesure de planification"
			/>
		</div>
	)
}
