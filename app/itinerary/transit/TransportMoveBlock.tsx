import Image from 'next/image'
import { transportTypeIcon } from './transportIcon'
import { isWhiteColor } from '@/components/css/utils'

export default function TransportMoveBlock({
	transport,
	background,
	textColor,
	name,
	route = null,
}) {
	return (
		<span
			css={`
				display: flex;
				align-items: center;
			`}
		>
			<Image
				src={transportTypeIcon(transport.route_type)}
				alt="Icône du type de transport : train, tram, bus, etc"
				width="100"
				height="100"
				css={`
					${isWhiteColor(textColor) && `filter: invert(1)`}
				`}
			/>
			{transport.icon ? (
				<Image
					src={transport.icon}
					alt={`Icône de l'entreprise de transport ${name}`}
					width="100"
					height="100"
					css={`
						filter: brightness(0) invert(1);
					`}
				/>
			) : (
				<strong
					css={`
						background: ${background};
						color: ${textColor};
						line-height: 1.2rem;
						border-radius: 0.4rem;
						white-space: nowrap;
					`}
					title={name}
				>
					{transport.frenchTrainType || name}
				</strong>
			)}
		</span>
	)
}
