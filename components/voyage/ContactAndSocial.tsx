import Emoji from '../Emoji'
import Image from 'next/image'
import css from '../css/convertToJs'

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
					style={css`
						display: flex;
						align-items: center;
					`}
				>
					<img
						src={'/annuaire-entreprises.svg'}
						alt="logo Marianne représentant l'annuaire des entreprises"
						style={css`
							margin: 0 0.3rem 0 0.2rem;
							width: 1.4rem;
							height: auto;
						`}
					/>
					<span>fiche entreprise</span>
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
