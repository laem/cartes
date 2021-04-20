import React from 'react'
import Meta from '../../components/utils/Meta'

export default () => (
	<div>
		<Meta
			title="Données personnelles"
			description="Nos gestes climat fonctionne sans serveur, donc vos données restent chez vous. Nous collectons anonymement des données aggregées pour améliorer le simulateur."
		/>
		<h1>Données personnelles</h1>
		<p>
			La simulation se fait sur votre navigateur, donc les réponses aux
			questions restent chez vous, nous n'en collectons aucune.
		</p>
		<p>
			Cependant, nous suivons quelques informations sur votre utilisation de ce
			simulateur, telles que les pages consultées et le temps passé, dans
			l'unique but de l'améliorer.{' '}
		</p>
		<p>
			En particulier, nous suivons l'adresse de la page de fin de simulation,
			qui contient le total de votre empreinte et sa répartition en grande
			catégories (transport, logement, ...).
		</p>
		<p>
			Vous pouvez en savoir plus et désactiver ce suivi{' '}
			<a href="https://ecolab.ademe.fr/vieprivee">sur cette page</a>
		</p>
	</div>
)
