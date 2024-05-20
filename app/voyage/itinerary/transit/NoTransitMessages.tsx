export const NoTransit = () => <p>Pas de transport en commun trouvé :( </p>
export const TransitScopeLimit = () => (
	<p
		css={`
			margin-top: 1rem;
		`}
	>
		<small>
			💡 Les transports en commun ne sont disponible qu'en Bretagne pour
			l'instant. Car le développeur est breton et qu'il faut bien commencer
			quelque part :)
		</small>
	</p>
)
export const NoMoreTransitToday = ({ date }) => (
	<section>
		<p>🫣 Pas de transport en commun à cette heure-ci</p>
		<DateSelector date={date} />
	</section>
)
