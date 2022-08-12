import { useEffect, useRef, useState } from 'react'
import Mega from './Mega'
import pathDataToPolys, { calcPolygonArea } from './svgPathToPolygons'

/* For each iteration on the SVG drawing,
 run this command :
 npx --yes  @svgr/cli --ref --replace-attr-values ../1ccc23d5/megaexpressfour.png=/images/megaexpressfour.png -- source/sites/publicodes/ferry/mega-express-four.svg > source/sites/publicodes/ferry/Mega.tsx

 */

const sumAreas = (elements, filter = () => true) =>
	elements.reduce((memo, next) => (filter(next) ? next.area : 0) + memo, 0)

export default ({ setData = () => null }) => {
	const ref = useRef(null)
	const [elements, setElements] = useState([])
	console.log('injection du modèle de surface du megaexpressfour')

	useEffect(() => {
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
			return next.id.includes('cabine') ? +next.id.split('-')[2] + memo : memo
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
			next.id.includes('cabine')
		)
		const siegesCount = elements.reduce((memo, next) => {
			return next.id.includes('sieges') ? +next.id.split('-')[2] + memo : memo
		}, 0)
		const siegesTotalArea = sumAreas(elements, (next) =>
			next.id.includes('sieges')
		)
		const surfacePontBas = sumAreas(elements, (next) =>
			next.id.includes('garage-bas')
		)
		const surfacePontHaut = sumAreas(elements, (next) =>
			next.id.includes('garage-haut')
		)

		const newData = {
			'cabine . nombre': cabinesCount,
			'siège . nombre': siegesCount,
			'surface . cabines': `${Math.round(cabinesTotalArea)} m2`,
			'surface . sièges': `${Math.round(siegesTotalArea)} m2`,
			'surface . garage . bas': surfacePontBas,
			'surface . garage . haut': surfacePontHaut,
			'surface . loisirs': sumAreas(elements, (next) =>
				next.id.includes('loisirs')
			),
			'surface . communs': sumAreas(elements, (next) =>
				next.id.includes('commun')
			),
		}
		console.log(newData)

		setData((data) => ({ ...data, ...newData }))
		return () => {
			console.log('This will be logged on unmount')
		}
	}, [])

	return (
		<div
			css={`
				svg {
					width: 100%;
					height: auto;
				}
				ul {
					display: flex;
					flex-wrap: wrap;
					list-style-type: none;
				}
				li {
					margin: 0.2rem;
				}
			`}
		>
			<h2>Modèle de volume du Mega Express Four</h2>
			<pre>
				Comment lire les blocs : PONT-ATTRIBUTION-NOMBRE/HAUTEURDEPONT (m):
				SURFACE (m²)
			</pre>
			<ul>
				{elements.map((el) => (
					<li
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
}
