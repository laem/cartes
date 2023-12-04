import osmLogo from '@/public/openstreetmap.svg'
import Image from 'next/image'
export default function OsmLinks({ data: { type: featureType, id } }) {
	return (
		<div
			css={`
				display: flex;
				margin-top: 2rem;
				justify-content: center;
				align-items: center;
				img {
					margin: 0 0.6rem;
				}
				background: var(--lightestColor);
				border-radius: 0.4rem;
				padding: 0.1rem 0.8rem;
				font-size: 80%;
			`}
		>
			<Image src={osmLogo} width="30" height="30" alt="Logo d'OpenStreetMap" />
			<div>
				<a
					href={`https://openstreetmap.org/${featureType}/${id}`}
					target="_blank"
				>
					voir sur OSM.org
				</a>
				&nbsp;-&nbsp;
				<a
					href={`https://openstreetmap.org/edit?${featureType}=${id}`}
					target="_blank"
				>
					améliorer
				</a>
			</div>
		</div>
	)
}
