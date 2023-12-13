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
				<a
					href={atOrUrl(facebook, 'https://facebook.com')}
					target="_blank"
					title="Compte Facebook"
				>
					<Emoji extra="E042" />
				</a>
			)}
			{instagram && (
				<a
					href={atOrUrl(instagram, 'https://instagram.com')}
					target="_blank"
					title="Compte Instagram"
				>
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

const atOrUrl = (key, domain) =>
	key
		.replace('http://', 'https://')
		.replace('://www.', '://')
		.startsWith(domain)
		? key
		: key.startsWith(domain.split('://')[1])
		? `https://${key}`
		: `${domain}/${key}`
