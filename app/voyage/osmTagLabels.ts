import rawData from '@openstreetmap/id-tagging-schema/dist/translations/fr.json'

const { presets, categories, fields } = rawData.fr.presets

export const getTagLabels = (key, value) => {
	const fullPreset = presets[key + '/' + value]
	if (fullPreset) return [fullPreset.name]

	const field = fields[key]

	if (!field) return [key, translateBasics(value)]

	const values = value.split(';'),
		translatedValues = values.map((v) => {
			const optionValue = field.options?.[v]
			switch (typeof optionValue) {
				case 'string':
					return optionValue
				case 'object':
					if (optionValue.title) return optionValue.title
				default:
					return translateBasics(v)
			}
		})
	return [field.label, translatedValues.join(' - ')]
}

const translateBasics = (value) => {
	const found = { yes: 'oui', no: 'non' }[value]
	return found || value
}

export const tagNameCorrespondance = (key) => {
	const found = {
		'diet:vegan': 'Végan',
		'diet:vegetarian': 'Végétarien',
		tobacco: 'Vente de tabac',
		'check_date:opening_hours': 'Horaires vérifiés le',
		pastry: 'Patisserie',
		female: 'Pour les femmes',
		male: 'Pour les hommes',
		official_name: 'Nom officiel',
		'payment:cash': 'Paiement en liquide',
		'payment:card': 'Paiement par carte',
		'payment:contactless': 'Paiement sans contact',
		'opening_hours:signed': 'Horaires affichés',
		'internet_access:fee': 'Accès Internet payant',
		'brand:website': 'Site de la marque',
		'service:bicycle:repair': 'Réparation de vélos',
		'service:bicycle:retail': 'Vente de vélos',
		books: 'Livres',
		short_name: 'Diminutif',
		old_name: 'Ancien nom',
		indoor_seating: "Sièges à l'intérieur",
		'capacity:disabled': 'Place de parking PMR',
		'website:menu': 'Menu',
		'building:levels': "Nombre d'étages",
		'emergency:phone': "Numéro d'urgence",
		'opening_hours:emergency': "Horaires en cas d'urgence",
		'ref:INSEE': 'Code INSEE',
		'ref:FR:SIREN': 'Code SIREN',
		'ref:FR:NAF': 'Code NAF',
		'ref:FR:FANTOIR': 'Code FANTOIR',
		'ref:FR:FINESS': 'Code FINESS',
	}[key]
	return found || key
}
export const tagValueCorrespondance = (key) => {
	const found = {
		children: 'Enfant',
	}[key]
	return found || key
}
