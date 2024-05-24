// Server components here
import Container from './Container'

const Page = ({ searchParams }) => {
	return (
		<main id="voyage" style={{ height: '100%' }}>
			<Container searchParams={searchParams} />
		</main>
	)
}

export default Page
