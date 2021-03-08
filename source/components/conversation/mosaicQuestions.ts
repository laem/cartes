import SelectWeeklyDiet from './select/SelectWeeklyDiet'
import SelectDevices from './select/SelectDevices'

const mosaicQuestions: Array<{
	question: string
	description: string
	isApplicable: Function
	component: React.FunctionComponent
}> = [
	{
		question: 'Quels appareils numériques possédez-vous ?',
		description: 'A remplir',
		isApplicable: (dottedName) =>
			dottedName.includes('numérique') && dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		question:
			'Choisissez les plats de vos midis et dîners pour une semaine type',
		description: 'A remplir',
		isApplicable: (dottedName) =>
			dottedName.includes('alimentation . plats') &&
			dottedName.includes(' . nombre'),
		component: SelectWeeklyDiet,
	},
]

export default mosaicQuestions
