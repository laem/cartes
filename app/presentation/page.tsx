import Link from 'next/link'
import Presentation from './presentation.mdx'
import { WebStore } from './UI'
import { PresentationWrapper } from './UI.tsx'
import Logo from '@/public/logo.svg'
import WebIcon from '@/public/web.svg'
import Image from 'next/image'

export default function () {
	return (
		<PresentationWrapper>
			<Presentation />

			<header>
				<h1>
					<Image src={Logo} alt="Logo de cartes.app" /> Cartes
				</h1>
				<h2>Libres, modernes et souveraines.</h2>
			</header>

			<WebStore>
				<Link href="/">
					<Image src={WebIcon} alt="Icône représentation le World Wide Web" />
					<div>
						<small>Disponible sur</small>
						<div>le Web</div>
					</div>
				</Link>
			</WebStore>
		</PresentationWrapper>
	)
}
