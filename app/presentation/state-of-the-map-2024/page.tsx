import Logo from '@/public/logo.svg'
import Image from 'next/image'
import { PresentationWrapper } from '../UI.tsx'
import Presentation from './presentation.mdx'

export default function () {
	return (
		<PresentationWrapper>
			<header>
				<h1>
					<Image src={Logo} alt="Logo de cartes.app" /> Cartes
				</h1>
				<h2>Présentation State of the Map 2024</h2>
			</header>
			<Presentation />
		</PresentationWrapper>
	)
}

// https://jhildenbiddle.github.io/css-device-frames/#/
