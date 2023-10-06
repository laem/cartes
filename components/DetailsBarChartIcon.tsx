import { IconStyle } from './DetailsBarChartIconUI'

export default function DetailedBarChartIcon() {
	return (
		<IconStyle title="Voir le détail du calcul" aria-hidden="true">
			{[10, 6, 3].map((score) => (
				<li
					key={score}
					css={`
						width: ${score * 10}%;
					`}
				></li>
			))}
		</IconStyle>
	)
}
