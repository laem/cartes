import NumberedMosaic from './select/NumberedMosaic'
import SelectDevices from './select/SelectDevices'
import { DottedName } from 'Rules'

const mosaicQuestions: Array<{
	question: string
	description: string
	isApplicable: Function
	component: React.FunctionComponent
	dottedName: DottedName
}> = [
	{
		dottedName: "numérique . liste d'appareils",
		options: { defaultsToFalse: true },
		question: 'Quels appareils numériques de moins de 10 ans possédez-vous ?',
		description: `
L'essentiel de l'empreinte du numérique réside dans les appareils que nous achetons. Renseignez ici vos appareils.


> ✨️ Par simplicité, ne renseignez que les appareils récents : un smartphone âgé de 10 ans a déjà été bien amorti. 
> Si vous l'avez acheté d'occasion il y a 3 ans et qu'il avait déjà environ 2 ans, considérez qu'il a 5 ans ! 

> 📡 Nous ajouterons au fur et à mesure d'autres types d'appareils : box internet, box TV, 2ème TV, imprimante, etc..
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('numérique') && dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: "divers . électroménager . liste d'appareils",
		options: { defaultsToFalse: true },
		question:
			'Quels appareils électroménagers de moins de 10 ans possédez-vous ?',
		description: `
L'essentiel de l'empreinte de l'électroménager réside dans les appareils que nous achetons.

> ✨️ Par simplicité, ne renseignez que les appareils récents : un réfrigérateur âgé de 10 ans a déjà été bien amorti.

Si tous vos appareils ne sont pas proposés dans cette liste, ce n'est pas grave, ce test ne se veut pas exhaustif.
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . électroménager') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'logement . modes de chauffage',
		options: { defaultsToFalse: true },
		question: 'Comment est chauffé votre logement ?',
		description: `
Certains logements sont chauffés entièrement à l'électricité, d'autres sont entièrement chauffés av  ec du gaz, et plus rarement du bois ou du fioul.·
      
Dans d'autres situations encore, un logement peut être chauffé principalement à l'électricité, mais   avec un appoint bois, par exemple.

Cochez tous les modes que vous utilisez.

			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('logement . chauffage') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'alimentation . régime',
		question:
			'Choisissez les plats de vos midis et dîners pour une semaine type',
		description: `

Choisissez 14 plats qui représentent votre semaine type : 7 midi et 7 dîners. 

> Aujourd'hui nous travaillons pour que les menus associés à vos repas soient les plus représentatifs de vos habitudes, n'hésitez pas à aller plus loin en parcourant [la documentation](https://nosgestesclimat.fr/documentation/alimentation/plats).

			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('alimentation . plats') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
		options: { chipsTotal: 14 },
	},
	{
		dottedName: 'divers . textile',
		question: 'Quels vêtements achetez-vous en général dans une année ?',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . textile') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
	},
]

export default mosaicQuestions
