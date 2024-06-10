import Emoji from '@/components/Emoji'
import { Drawer } from 'vaul'

const popSize = 6
export default function ModalSheetReminder({}) {
	return (
		<Drawer.Trigger asChild>
			<button
				css={`
					background: red;
					position: fixed;
					bottom: -${popSize / 2}rem;
					left: -${popSize / 2}rem;
					background: var(--lightestColor);
					width: ${popSize}rem;
					height: ${popSize}rem;
					border-radius: ${popSize}rem;
					border: 2px solid var(--color);
					box-shadow: rgba(0, 0, 0, 0.3) 0px -2px 16px;
					cursor: pointer;
					> span {
						position: absolute;
						top: 0.9rem;
						right: 0.9rem;
					}
				`}
			>
				<Emoji e="🔎" />
			</button>
		</Drawer.Trigger>
	)
}
