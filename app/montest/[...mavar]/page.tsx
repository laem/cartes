import Test from './Test'

export default function MaVar({ params: { mavar } }) {
	return (
		<>
			<h1>Mon titre</h1>
			<Test maVar={mavar} />
		</>
	)
}
