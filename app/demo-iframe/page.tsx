import Script from 'next/script'
export default () => (
	<main>
		<h1>Démo de l'intégration en iframe</h1>

		<Script
			src="https://nextfu.vercel.app/iframe.js"
			id="futureco"
			path="simulateur/transport/avion/impact"
		/>
	</main>
)
