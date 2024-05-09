import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./Map'), {
	ssr: false,
})

const Page = ({ searchParams }) => (
	<main id="voyage" style={{ height: '100%' }}>
		<Map searchParams={searchParams} />
	</main>
)

export default Page
