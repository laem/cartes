import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { styles } from './styles'

export default function StyleChooser({ style, setStyleChooser }) {
	const setSearchParams = useSetSearchParams()
	return (
		<ul>
			{Object.entries(styles).map(
				([k, { emoji, name, id, image, imageAlt }]) => (
					<li key={k}>
						<Link
							href={setSearchParams({ style: k }, true, false)}
							title={'Passer au style ' + name}
							onClick={() => setTimeout(() => setStyleChooser(false), 200)}
						>
							{emoji ? (
								<Emoji e={emoji} />
							) : (
								<img
									src={'/' + image}
									width="50"
									height="50"
									alt={imageAlt}
									style={css`
										width: 2rem;
										height: 2rem;
									`}
								/>
							)}
							<div>{name}</div>
						</Link>
					</li>
				)
			)}
		</ul>
	)
}
