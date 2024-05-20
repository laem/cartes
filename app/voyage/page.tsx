import dynamic from 'next/dynamic'
// Map is forced as dynamic since it can't be rendered by nextjs server-side.
// There is almost no interest to do that anyway, except image screenshots
const Map = dynamic(() => import('./Map'), {
	ssr: false,
})

// But lots of content components that are not needing the map can be rendered
// to provide link previews crucial for sharing place links

const Page = ({ searchParams }) => (
	<main id="voyage" style={{ height: '100%' }}>
		<Map searchParams={searchParams} />
	</main>
)

export default Page
