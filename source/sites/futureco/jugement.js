import React from 'react'
import emoji from 'react-easy-emoji'

export const PasSoutenable = () => (
	<div>
		<h1>{emoji('😟')} Journée pas écolo</h1>
		<p>
			Ta journée n'est pas soutenable, car elle dépasse la capacité de notre
			pays à absorber tes émissions de gaz à effet de serre.
		</p>
		<h2>Pas de panique ! </h2>
		<p>
			On est presque tout dans ton cas en France, et ce n'est pas la fin du
			monde, en tout cas pour l'instant...
		</p>
		<button>OK</button>
	</div>
)

export const AccordDeParis = () => (
	<div>
		<p>
			Pas facile d'être sobre dans une société fondée sur la croissance du PIB.
		</p>
		<p>
			Fin 2015 à Paris, le monde l'a bien compris et s'est mis d'accord pour
			qu'on limite la casse climatique à un réchauffement compris entre 1.5° et
			2°.{' '}
		</p>
		<p>
			Les conséquences d'un réchauffement de 1.5° seront très graves, c'est
			mieux que 2° : chaque dixième de degré compte.
		</p>
		<p>Alors, prêt à relever le défi ?</p>
		<button>C'est parti ! </button>
		<a href="https://www.auto-moto.com/" target="_blank">
			<button>Non</button>
		</a>
	</div>
)
export const objectif1point5 = () => (
	<div>
		<h1>Objectif 1.5° : réussi {emoji('✅')}</h1>
		<p>
			Bravo, tu sembles être sur la voie d'un réchauffement pas si
			catastrophique, et c'est pas donné à tout le monde.
		</p>
		<p>
			Attention cependant, tu restes au-dessus de l'équilibre des 2 tonnes de
			CO2e/an. Chaque année, l'objectif sera rendu plus exigeant pour finalement
			atteindre cet objectif.
		</p>
		<button>Voir mes résultats</button>
	</div>
)

export const objectif1point5raté = () => (
	<div>
		<h1>objectif 1.5° : râté</h1>
		<p>
			aujourd'hui, un français a une empreinte climat de 11 tonnes par an en
			moyenne.
		</p>
		<p>
			pour rester sous les 1.5°, il faut réduire notre empreinte de 7% par an à
			partir du 1er janvier 2020.
		</p>
		<p>
			tu as dépassé cet objectif. on est d'accord, c'est pas facile. mais
			gardons espoir, il te reste l'objectif des 2°.
		</p>
		<button>continuer</button>
	</div>
)
export const objectif2 = () => (
	<div>
		<h1>Objectif 2° : réussi {emoji('✅')}</h1>
		<p>
			Bravo, tu sembles être sur la voie qui évite la catastrophe climatique
			totale.
		</p>
		<p>
			Attention cependant, tu restes largement au-dessus de l'équilibre des 2
			tonnes de CO2e/an. Chaque année, l'objectif sera rendu plus exigeant pour
			finalement atteindre cet objectif.
		</p>
		<p>On se retrouve dans quelques mois {emoji('😊')}?</p>
		<button>Voir mes résultats</button>
	</div>
)

export const Objectif2Raté = () => (
	<div>
		<h1>Objectif 2° : râté</h1>
		<p>
			Cette journée te place décidemment bien loin des objectifs de l'accord de
			Paris.
		</p>
		<h2>Tout n'est pas perdu !</h2>
		<p>
			Comme nous l'a montré le sprinteur{' '}
			<a href="https://www.youtube.com/watch?v=f2Dil00Pgbw" target="_blank">
				{' '}
				Marc Raquil{' '}
			</a>
			, peu importe le départ, l'essentiel c'est d'accélérer, on compte sur toi,
			et à bientôt !
		</p>
		<button>Voir mes résultats</button>
	</div>
)

export const Soutenable = () => (
	<div>
		<h1>{emoji('🥳')} Magnifique ! </h1>
		<p>
			On dirait bien que tu a emprunté le chemin d'une vie soutenable,
			félicitations.
		</p>
		<p>
			Restons calme cependant : il s'agirait de ne pas gâcher cette belle
			journée soutenable par des vacances à Bali cet été.
		</p>
		<p>
			{emoji('💡 ')} Tu pourras bientôt faire le bilan de ton année entière.
		</p>
		<p>
			Futureco ne mesure pour l'instant que notre impact sur le climat. Vu ton
			excellent score, ton empreinte sur les autres indicateurs, comme la
			biodiversité, devrait être limité aussi, mais soyons vigileants !
		</p>
	</div>
)
