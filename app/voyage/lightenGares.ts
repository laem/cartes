const fs = require('fs')

//https://ressources.data.sncf.com/explore/dataset/referentiel-gares-voyageurs
let rawdata = fs.readFileSync('./referentiel-gares-voyageurs.json')
let data = JSON.parse(rawdata)

const result = data
	.map((gare) => {
		const {
			commune_code: commune,
			gare_alias_libelle_noncontraint: nom,
			uic_code: uic,
			niveauservice_libelle: niveau,
			longitude_entreeprincipale_wgs84,
			latitude_entreeprincipale_wgs84,
		} = gare

		return {
			coordonnées: [
				longitude_entreeprincipale_wgs84,
				latitude_entreeprincipale_wgs84,
			],
			commune,
			nom,
			uic,
			niveau,
		}
	})
	.reduce(
		(memo, next) =>
			memo.find((gare) => gare.nom === next.nom) ? memo : [...memo, next],
		[]
	)

fs.writeFileSync('gares.json', JSON.stringify(result))

console.log('first two results', result[1], result[2])
