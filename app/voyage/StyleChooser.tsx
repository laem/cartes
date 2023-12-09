import Emoji from '@/components/Emoji'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { styles } from './styles'

export default function StyleChooser({ style, setStyleChooser }) {
	const setSearchParams = useSetSearchParams()
	return (
		<ul>
			{Object.entries(styles).map(([k, { emoji, name, id }]) => (
				<li key={k}>
					<Link
						href={setSearchParams({ style: k }, true, false)}
						title={'Passer au style ' + name}
						onClick={() => setTimeout(() => setStyleChooser(false), 200)}
					>
						<Emoji e={emoji} />
						<div>{name}</div>
					</Link>
				</li>
			))}
		</ul>
	)
}
