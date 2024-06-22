import css from 'Components/css/convertToJs'
import Emoji from 'Components/Emoji'
import useSetSearchParams from 'Components/useSetSearchParams'
import Link from 'next/link'
import { styles } from './styles'
import { ModalCloseButton } from '../UI'

const styleList = Object.entries(styles)
export default function StyleChooser({ style, setStyleChooser, setSnap }) {
	const setSearchParams = useSetSearchParams()
	console.log(style)
	return (
		<section
			css={`
				h2 {
					margin-top: 0;
				}
				position: relative;
			`}
		>
			<ModalCloseButton
				title="Fermer l'encart de choix du style"
				onClick={() => {
					setTimeout(() => setSnap(3), 200)
					setSearchParams({ 'choix du style': undefined })
				}}
			/>
			<h2>Choisir le fond de carte</h2>
			<Styles
				styleList={styleList.filter(([, el]) => !el.experimental)}
				setSearchParams={setSearchParams}
				style={style}
			/>
			<details>
				<summary
					css={`
						color: #aaa;
						text-align: right;
						margin: 1.4rem 3rem 0.8rem 0;
					`}
				>
					Styles expérimentaux
				</summary>
				<Styles
					styleList={styleList.filter(([, el]) => el.experimental)}
					setSearchParams={setSearchParams}
					style={style}
				/>
			</details>
		</section>
	)
}

const Styles = ({ style, styleList, setSearchParams }) => (
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
		{styleList.map(([k, { name, imageAlt, title, image: imageProp }]) => {
			const image = (imageProp || k) + '.png'

			return (
				<li
					key={k}
					css={`
						margin: 0.6rem;
					`}
				>
					<Link
						href={setSearchParams({ style: k }, true, false)}
						title={'Passer au style ' + (title || name)}
						css={`
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							text-decoration: none;
							color: inherit;
							${style.key === k && `color: var(--color); font-weight: bold`}
						`}
					>
						<img
							src={'/styles/' + image}
							width="50"
							height="50"
							alt={imageAlt}
							css={`
								width: 5.5rem;
								height: 5.5rem;
								border-radius: 0.4rem;
								${style.key === k &&
								`border: 3px solid var(--color);
								`}
							`}
						/>
						<div>{name}</div>
					</Link>
				</li>
			)
		})}
	</ul>
)
