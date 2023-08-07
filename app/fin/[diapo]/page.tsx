import {
	Perdu,
	Définition,
	Suffisant,
	Changer,
	Chemin,
	Sources,
	Action,
	Quand,
	Danger,
	Culpabilisation,
	LeSystème,
	PourquoiTrois,
	Claque,
	Trajectoire,
	Ensemble,
} from 'Components/GameOver'

export default ({ params: { diapo } }) => {
	switch (diapo) {
		case 'perdu':
			return <Perdu />
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
