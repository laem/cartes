import Emoji from '../Emoji'

export default function ContactAndSocial({
	email,

	facebook,
	instagram,
	siret,
}) {
	return (
		<div
			css={`
				margin-bottom: 0.6rem;
			`}
		>
			{email && (
				<a
					href={`mailto:${email}`}
					target="_blank"
					title="Contacter via courriel"
				>
					<Emoji e="📧" />
				</a>
			)}
			{facebook && (
				<a href={facebook} target="_blank" title="Compte Facebook">
					<Emoji extra="E042" />
				</a>
			)}
			{instagram && (
				<a href={instagram} target="_blank" title="Compte Instagram">
					<Emoji extra="E043" />
				</a>
			)}
			{siret && (
				<a
					href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`}
					target="_blank"
					title="Fiche entreprise sur l'annuaire officiel des entreprises"
				>
					<Emoji e="🇫🇷" />
				</a>
			)}
		</div>
	)
}
