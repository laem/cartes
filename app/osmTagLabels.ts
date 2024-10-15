import rawData from '@openstreetmap/id-tagging-schema/dist/translations/fr.json'

const { presets, fields } = rawData.fr.presets

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
					break
				default:
					return translateBasics(v)
			}
		})
	return [field.label, translatedValues.join(' - ')]
}

const translateBasics = (value: string) => {
	const found = { yes: 'oui', no: 'non' }[value]
	return found || value
}

// This is only a complement to the above imported set of translations.
// This list could someday be backported by whoever is motivated to make the contribution :)
export const tagNameCorrespondance = (key: string) => {
	const found = {
		alt_name: 'Autre nom',
		artist_name: "Nom de l'artiste",
		'award:accueilvelo': "Label Accueil Vélo",
		books: 'Livres',
		'brand:website': 'Site de la marque',
		'building:architecture': 'Style architectural',
		'building:levels': "Nombre d'étages",
		bulk_purchase: 'Achat en vrac',
		'capacity:disabled': 'Place de parking PMR',
		'check_date:opening_hours': 'Horaires vérifiés le',
		'check_date:wheelchair': 'Accès PMR vérifié le',
		'diet:dairy_free': 'Sans produits laitiers',
		'diet:gluten_free': 'Sans gluten',
		'diet:halal': 'Halal',
		'diet:kosher': 'Casher',
		'diet:lactose_free': 'Sans lactose',
		'diet:vegan': 'Végan',
		'diet:vegetarian': 'Végétarien',
		'emergency:phone': "Numéro d'urgence",
		female: 'Pour les femmes',
		'garden:style': 'Style de jardin',
		indoor_seating: "Sièges à l'intérieur",
		'internet_access:fee': 'Accès Internet payant',
		male: 'Pour les hommes',
		official_name: 'Nom officiel',
		old_name: 'Ancien nom',
		'opening_hours:emergency': "Horaires en cas d'urgence",
		'opening_hours:signed': 'Horaires affichés',
		'operator:type': "Type d'opérateur",
		pastry: 'Patisserie',
		'payment:app': 'Paiement par application',
		'payment:card': 'Paiement par carte',
		'payment:cash': 'Paiement en liquide',
		'payment:contactless': 'Paiement sans contact',
		'payment:credit_cards': 'Paiement par carte de crédit',
	  'payment:debit_cards': 'Paiment par carte de débit',
		'payment:mastercard': 'Paiement par Mastercard',
		'payment:visa': 'Paiement par Visa',
		'phone:mobile': 'N° de mobile',
		'service:bicycle:cleaning': 'Lavage de vélos',
		'service:bicycle:diy': "Atelier d'autoréparation de vélos",
		'service:bicycle:pump': 'Pompe à vélo en libre-service',
		'service:bicycle:rental': 'Location de vélos',
		'service:bicycle:repair': 'Réparation de vélos',
		'service:bicycle:retail': 'Vente de vélos',
		'service:bicycle:second_hand': "Vente de vélos d'occasion",
		short_name: 'Diminutif',
		tobacco: 'Vente de tabac',
		'toilets:wheelchair': 'Toilettes accessibles aux PMR',
		'website:menu': 'Menu',
		'ref:INSEE': 'Code INSEE',
		'ref:FR:SIREN': 'Code SIREN',
		'ref:FR:NAF': 'Code NAF',
		'ref:FR:FANTOIR': 'Code FANTOIR',
		'ref:FR:FINESS': 'Code FINESS',
		passenger_information_display: "écran d'information voyageur",
		'survey:date': 'Dernière date de vérification',
		'species:fr': 'Espèce (fr)',
	}[key]
	return found || key
}
export const tagValueCorrespondance = (key: string) => {
	const found = {
		children: 'Enfant',
		only: 'Uniquement',
	}[key]
	return found || key
}
