export default function GareInfo({ clickedGare }) {
	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 70vh;

				iframe {
					width: 100%;
					border: 6px solid var(--color);
					height: 100%;
				}
				h2 {
					margin-bottom: 0rem;
					font-size: 120%;
					background: var(--color);
					width: 100%;
					text-align: center;
					padding: 0.2rem 0;
					max-width: 20rem;
					border-top-left-radius: 0.4rem;
					border-top-right-radius: 0.4rem;
				}
				@media (min-width: 1200px) {
					width: 35rem;
				}
			`}
		>
			<h2>Gare de {clickedGare.nom}</h2>
			<iframe
				src={`https://tableau-sncf.vercel.app/station/stop_area:SNCF:${clickedGare.uic.slice(
					2
				)}`}
			/>
		</div>
	)
}
