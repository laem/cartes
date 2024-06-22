import { getRules } from '@/providers/getRules'
import {
	Action,
	Changer,
	Chemin,
	Claque,
	Culpabilisation,
	Danger,
	Définition,
	Ensemble,
	LeSystème,
	Perdu,
	PourquoiTrois,
	Quand,
	Sources,
	Suffisant,
	Trajectoire,
} from 'Components/GameOver'

const Page = async ({ params: { diapo } }) => {
	const rules = await getRules('NGC')
	switch (diapo) {
		case 'perdu':
			return <Perdu rules={rules} />
		case 'definition':
			return <Définition />
		case 'suffisant':
			return <Suffisant />
		case 'changer':
			return <Changer />
		case 'chemin':
			return <Chemin />
		case 'sources':
			return <Sources />
		case 'action':
			return <Action />
		case 'quand':
			return <Quand />
		case 'danger':
			return <Danger />
		case 'culpabilisation':
			return <Culpabilisation />
		case 'le-systeme':
			return <LeSystème />
		case 'pourquoi-trois':
			return <PourquoiTrois />
		case 'claque':
			return <Claque />
		case 'trajectoire':
			return <Trajectoire />
		case 'ensemble':
			return <Ensemble />
	}
}

export default Page
