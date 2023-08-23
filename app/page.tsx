import Link from 'next/link'
import Image from 'next/image'

import Emoji from 'Components/Emoji'
import { Card, LoudButton } from 'Components/UI'
import {
	CardList,
	Container,
	Content,
	Header,
	Image as StyledImage,
} from './Landing'
import incendie from 'public/incendie.png'

const Page = () => {
	return (
		<Container>
			<StyledImage>
				<Image src={incendie} alt="Photo d'un incendie terrible" />
			</StyledImage>

			<Content>
				<Header>
					<h1>
						<strong>Écolo</strong>,
						<br /> ou pas ?
					</h1>
					<p>
						<em>
							Le jeu dont <em>vous</em> êtes le héros.
						</em>
					</p>
				</Header>
				<LoudButton to="/instructions">Faire le test</LoudButton>
				<p>
					<Emoji e="⏱️" /> 2 minutes chrono
				</p>

				<h2>Mini-calculateurs</h2>
				<CardList>
					<li>
						<Link href="/simulateur/transport/ferry/empreinte-du-voyage">
							<Card>
								<div>
									<Emoji e="⛴️" />
								</div>
								<h3>Ferry</h3>
							</Card>
						</Link>
					</li>

					<li>
						<Link href="/simulateur/transport/avion/impact">
							<Card>
								<div>
									<Emoji e="✈️" />
								</div>
								<h3>Avion</h3>
							</Card>
						</Link>
					</li>
					<li>
						<Link href="/simulateur/piscine/empreinte">
							<Card>
								<div>
									<Emoji e="🏊️" />
								</div>
								<h3>Piscine</h3>
							</Card>
						</Link>
					</li>
					<li>
						<Link href="/wiki">
							<Card>
								<div>
									<Emoji e="➕" />
								</div>
								<h3>Tout le reste</h3>
							</Card>
						</Link>
					</li>
				</CardList>
			</Content>
		</Container>
	)
}

export default Page
