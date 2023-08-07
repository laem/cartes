import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { batchUpdateSituation } from '@/actions'
import { situationSelector } from 'Selectors/simulationSelectors'
import Mega from './Mega'
import pathDataToPolys, { calcPolygonArea } from './svgPathToPolygons'

/* For each iteration on the SVG drawing,
 run this command :
 npx --yes  @svgr/cli --no-svgo --ref --replace-attr-values ../1ccc23d5/megaexpressfour.png=/images/megaexpressfour.png -- source/sites/publicodes/ferry/mega-express-four.svg > source/sites/publicodes/ferry/Mega.tsx


 */

const sumAreas = (elements, filter = () => true) =>
	elements.reduce((memo, next) => (filter(next) ? next.area : 0) + memo, 0)

const Lab = ({}) => {
	const ref = useRef(null)
	const [elements, setElements] = useState([])
	const dispatch = useDispatch()
	const setData = (data) => dispatch(batchUpdateSituation(data), true)
	const [computed, setComputed] = useState(null)
	const situation = useSelector(situationSelector)

	useEffect(() => {
		//rerun this on situation RESET
		if (Object.keys(situation).length > 0) return
		const el = ref.current
		if (!el) return undefined
		const elements = [...el.querySelectorAll('path')].map((path) => {
			const d = path.getAttribute('d')
			let points = d && pathDataToPolys(d, { tolerance: 1, decimals: 1 })
			const pixelArea = points && Math.round(calcPolygonArea(points[0]))
			// https://fr.wikipedia.org/wiki/Mega_Express_Four
			const megaExpressFourLengthOverall = 173.7, // real length in meters of the ship
				megaExpressPixelLength = 340 // This is the length corresponding to the length overall, but as drawn on the SVG image
			const area =
				(pixelArea * megaExpressFourLengthOverall) / megaExpressPixelLength
			const color = getComputedStyle(path).getPropertyValue('stroke')

			return { id: path.id, area: Math.round(area), color }
		})
		setElements(elements)

		const cabinesCount = elements.reduce((memo, next) => {
			return next.id.includes('-cabines') ? +next.id.split('-')[2] + memo : memo
		}, 0)
		// Cette page cite 252 cabines, ce qui correspond environ à notre calcul de 255 :)
		// https://corsica-battelli.jimdofree.com/navires/corsica-ferries/méga-express-four/
		//
		// Avec 280 places en fauteuil, on retrouve au total si 4 personnes par cabine 1300 passager max.
		// Ceci sans compter les places sans fauteil.
		// On a donc potentiellement un problème, le mega est annoncé à 1800 passagers max depuis 2007.
		// Hypothèse probable : il peut accueillir tous ces passagers sur les traversées sans nuits, et avec une partie des gens dans les couloirs la nuit.
		// Retour utilisateur : j'étais justement sur le mega express four aller (nuit) et retour (jour), il était complet dans les deux sens et on avait vraiment le sentiment qu'il n'y avait pas de places assises ou en cabines pour tout le monde. Énormément de gens s'installent partout sur le bateau pour se reposer, sous les tables, dans les couloirs, dans les coursives. Ca fait en passant une ambiance assez surprenante vu la classe sociale des voyageurs - et en comparaison le confort des véhicules transportés.

		const cabinesTotalArea = sumAreas(elements, (next) =>
			next.id.includes('-cabines')
		)
		const siegesCount = elements.reduce((memo, next) => {
			return next.id.includes('-sieges') ? +next.id.split('-')[2] + memo : memo
		}, 0)
		const siegesTotalArea = sumAreas(elements, (next) =>
			next.id.includes('-sieges')
		)
		const surfacePontBas = sumAreas(elements, (next) =>
			next.id.includes('-garage-bas')
		)
		const surfacePontHaut = sumAreas(elements, (next) =>
			next.id.includes('-garage-haut')
		)

		const areaUnit = (value) => `${Math.round(value)} m2`

		const newDataUnprefixed = {
			'cabine . nombre': cabinesCount,
			'siège . nombre': siegesCount,
			'surface . cabines': areaUnit(cabinesTotalArea),
			'surface . sièges': areaUnit(siegesTotalArea),
			'surface . garage . bas': areaUnit(surfacePontBas),
			'surface . garage . haut': areaUnit(surfacePontHaut),
			'surface . loisirs': areaUnit(
				sumAreas(elements, (next) => next.id.includes('-loisirs'))
			),
			'surface . communs': areaUnit(
				sumAreas(elements, (next) => next.id.includes('-commun'))
			),
		}
		setComputed(newDataUnprefixed)

		const newData = Object.fromEntries(
			Object.entries(newDataUnprefixed).map(([k, v]) => [
				'transport . ferry . ' + k,
				v,
			])
		)

		//This elements lets us check if the measured area of a cabine looks correct considering the length and width of two beds
		const surfaceCheck = elements.find((el) => el.id.includes('-unecabine'))

		console.log(
			newData,
			`Surface de la cabine témoin : ${surfaceCheck.area} m2`
		)

		// Result : 19 m² for a now window cabine
		// Considering a 1*2m bed, another one, 1m between them, plus a 4m entrance + toilets, we've got 18m²
		// Which makes a good order of magnitude, but still subject to some errors until we get a precise plan of the cabine

		setData(newData)
		return () => {
			console.log('This will be logged on unmount')
		}
	}, [situation])

	return (
		<div
			css={`
				svg {
					width: 100%;
					height: auto;
				}
				max-width: 90% !important;
			`}
			className="ui__ container"
		>
			<h2>Modèle de volume du Mega Express Four</h2>
			{computed && (
				<>
					<h3>Surfaces totales par usage</h3>
					<ul>
						{Object.entries(computed).map(([k, v]) => (
							<li key={k}>
								{k} : {v}
							</li>
						))}
					</ul>
				</>
			)}
			<h3>Détails du calcul de surfaces</h3>
			<pre>
				Comment lire les blocs : PONT-ATTRIBUTION-NOMBRE/HAUTEURDEPONT (m):
				SURFACE (m²)
			</pre>
			<ul
				css={`
					display: flex;
					flex-wrap: wrap;
					list-style-type: none;
					li {
						margin: 0.2rem;
					}
				`}
			>
				{elements.map((el) => (
					<li
						key={el.id}
						className="ui__ card content"
						css={`
							border: 2px solid ${el.color};
						`}
					>
						{el.id} : {el.area} m²
					</li>
				))}
			</ul>
			<Mega ref={ref} />
		</div>
	)
};

export default Lab;
