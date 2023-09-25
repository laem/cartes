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
	const [playActive] = useSound('/national/sounds/pop-down.mp3', {
		volume: 0.25,
	})
	const [playOn] = useSound('/national/sounds/pop-up-on.mp3', { volume: 0.25 })
	const [playOff] = useSound('/national/sounds/pop-up-off.mp3', {
		volume: 0.25,
	})

	return (
		<div
			onMouseDown={() => formule != null && playActive()}
			onMouseUp={() => {
				isChecked ? playOff() : playOn()
			}}
			onClick={() => {
				formule != null && playOn()

				formule != null &&
					setState((state) => ({ ...state, [titre]: !state[titre] }))
			}}
		>
			<Checkbox checked={isChecked} title="Cocher pour activer cette mesure de planification"/>
		</div>
	)
}
