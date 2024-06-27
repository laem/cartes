import CaptureSpacebar from '@/components/diapos/CaptureSpacebar'
import { DiapoWrapper } from '@/components/diapos/Wrapper'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import { PresentationWrapper } from '../UI.tsx'

import Presentation1 from './presentation1.mdx'
import Presentation2 from './presentation2.mdx'
import Presentation3 from './presentation3.mdx'
import Presentation4 from './presentation4.mdx'

export default function () {
	return (
		<CaptureSpacebar>
			<DiapoWrapper>
				<section>
					<PresentationWrapper>
						<header>
							<h1>
								<Image src={Logo} alt="Logo de cartes.app" /> Cartes
							</h1>
							<h2>Présentation State of the Map 2024</h2>
						</header>
					</PresentationWrapper>
				</section>
				<Presentation1 />
				<Presentation2 />
				<Presentation3 />
				<Presentation4 />
			</DiapoWrapper>
		</CaptureSpacebar>
	)
}

// https://jhildenbiddle.github.io/css-device-frames/#/
