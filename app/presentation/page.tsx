import Link from 'next/link'
import Presentation from './presentation.mdx'
import { Screens, WebStore } from './UI'
import { PresentationWrapper } from './UI.tsx'
import Logo from '@/public/logo.svg'
import WebIcon from '@/public/web.svg'
import Image from 'next/image'
import './devices.css'
import Phone from './Phone'

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
			<Screens>
				<Phone imgSrc={'/screenshots/trépassés.png'} />
				<Phone imgSrc={'/screenshots/cordée.png'} />
				<Phone imgSrc={'/screenshots/bus.png'} />
			</Screens>
		</PresentationWrapper>
	)
}

// https://jhildenbiddle.github.io/css-device-frames/#/
