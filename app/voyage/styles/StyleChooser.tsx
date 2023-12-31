import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { styles } from './styles'

export default function StyleChooser({ style, setStyleChooser }) {
	const setSearchParams = useSetSearchParams()
	return (
		<ul
			style={css`
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				align-items: center;
				list-style-type: none;
				margin-top: 1rem;
			`}
		>
			{Object.entries(styles).map(
				([k, { emoji, name, id, image, imageAlt }]) => (
					<li
						key={k}
						style={css`
							margin: 0.2rem;
							border: 1px solid var(--color);
							background: var(--lighterColor);
							border-radius: 0.4rem;
						`}
					>
						<Link
							href={setSearchParams({ style: k }, true, false)}
							title={'Passer au style ' + name}
							onClick={() => setTimeout(() => setStyleChooser(false), 200)}
							style={css`
								width: 8rem;
								height: 6rem;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								text-decoration: none;
								color: inherit;
							`}
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
