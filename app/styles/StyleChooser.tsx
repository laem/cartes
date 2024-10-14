import css from '@/components/css/convertToJs'
import useSetSearchParams from '@/components/useSetSearchParams'
import informationIcon from '@/public/information.svg'
import panoramaxIcon from '@/public/panoramax-simple.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { ModalCloseButton } from '../UI'
import { styles } from './styles'

const styleList = Object.entries(styles)
export default function StyleChooser({
	style,
	setStyleChooser,
	setSnap,
	searchParams,
	zoom,
	setZoom,
}) {
	const setSearchParams = useSetSearchParams()

	return (
		<section
			css={`
				h1 {
					font-size: 160%;
					font-weight: 300;
					margin-top: 0;
					margin-left: 0.4rem;
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
			<h1>Fond de carte</h1>
			<section
				css={`
					padding: 0 1rem;
					label {
						display: flex;
						align-items: center;
						input {
							margin-right: 0.4rem;
						}
						cursor: pointer;
						img {
							width: 1.3rem;
							margin-bottom: 0.15rem;
							height: auto;
							margin-right: 0.2rem;
							vertical-align: middle;
						}
					}
				`}
			>
				<label title="Afficher sur la carte les photos de rue Panoramax disponibles">
					<input
						type="checkbox"
						checked={
							searchParams.panoramax != null || searchParams.rue === 'oui'
						}
						onChange={() => {
							if (searchParams.rue === 'oui')
								setSearchParams({ rue: undefined })
							else {
								if (zoom < 7) setZoom(7)
								setSearchParams({ rue: 'oui' })
							}
						}}
					/>
					<span>
						<Image src={panoramaxIcon} alt="Logo du projet Panoramax" />
						Photos de rue
					</span>
				</label>
			</section>
			<Styles
				styleList={styleList.filter(([, el]) => !el.secondary)}
				setSearchParams={setSearchParams}
				style={style}
			/>
			<details>
				<summary
					css={`
						color: #aaa;
						text-align: right;
						margin: 1.4rem 1.4rem 0.8rem 0;
					`}
				>
					Autres styles
				</summary>
				<Styles
					styleList={styleList.filter(([, el]) => el.secondary)}
					setSearchParams={setSearchParams}
					style={style}
					searchParams={searchParams}
				/>
			</details>
		</section>
	)
}

const Styles = ({ style, styleList, setSearchParams, searchParams }) => {
	const [localStorageStyleKey, setLocalStorageStyleKey] = useLocalStorage(
		'style',
		null
	)
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
			{styleList.map(
				([k, { name, imageAlt, title, image: imageProp, description }]) => {
					const image = (imageProp || k) + '.png'

					return (
						<li
							key={k}
							css={`
								margin: 0.6rem 0.25rem;
							`}
						>
							<Link
								href={setSearchParams(
									{ style: k, 'choix du style': 'oui' },
									true,
									true
								)}
								onClick={() => setLocalStorageStyleKey(k)}
								title={'Passer au style ' + (title || name)}
								css={`
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									text-decoration: none;
									color: inherit;
									${style.key === k && `color: var(--color); font-weight: bold`}
									background: white;
									border-radius: 0.4rem;
									border: 1px solid var(--lightestColor);
								`}
							>
								<img
									src={'/styles/' + image}
									width="50"
									height="50"
									alt={imageAlt}
									css={`
										width: 6rem;
										height: 5rem;
										object-fit: cover;
										border-top-left-radius: 0.4rem;
										border-top-right-radius: 0.4rem;
										${style.key === k &&
										`border: 3px solid var(--color);
								`}
									`}
								/>
								<div
									css={`
										position: relative;
										width: 100%;
										text-align: center;
										line-height: 1.9rem;
										img {
											position: absolute;
											right: -0.5rem;
											top: -0.6rem;
											width: 1.2rem;
											height: auto;
										}
									`}
								>
									{name}
									{description && (
										<aside
											onClick={(e) => {
												alert(description)
												e.preventDefault()
											}}
										>
											<Image
												src={informationIcon}
												alt="Informations sur le style"
											/>
										</aside>
									)}
								</div>
							</Link>
						</li>
					)
				}
			)}
		</ul>
	)
}
