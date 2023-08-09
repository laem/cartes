import Link from 'next/link'

import Emoji from 'Components/Emoji'
import { Card, LoudButton } from 'Components/UI'
import { CardList, Container, Content, Header, Image } from './Landing'

const Page = () => {
	return (
		<Container>
			<Image
				srcSet="https://i.imgur.com/HXWewY4l.jpg 640w, https://i.imgur.com/HXWewY4.jpg 1720w "
				src="https://i.imgur.com/HXWewY4.jpg"
				alt="Photo d'un incendie terrible"
			/>

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
					{/*
					<Link href="/ferry">
						<Card>
							<div>
								<Emoji e="⛴️" />
							</div>
							<h3>Ferry</h3>
						</Card>
					</Link>
					<Link href="/simulateur/transport/avion/impact">
						<Card>
							<div>
								<Emoji e="✈️" />
							</div>
							<h3>Avion</h3>
						</Card>
					</Link>
					*/}

					<Link href="/simulateur/piscine/empreinte">
						<Card>
							<div>
								<Emoji e="🏊️" />
							</div>
							<h3>Piscine</h3>
						</Card>
					</Link>
					<Link href="/wiki">
						<Card>
							<div>
								<Emoji e="➕" />
							</div>
							<h3>Tout le reste</h3>
						</Card>
					</Link>
				</CardList>
			</Content>
		</Container>
	)
}

export default Page
