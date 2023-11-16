import { useMediaQuery } from 'usehooks-ts'
import dynamic from 'next/dynamic'

const ModalSheet = dynamic(() => import('./ModalSheet'), {
	ssr: false,
})
const SideSheet = dynamic(() => import('./SideSheet'), {
	ssr: true,
})

export default function ModalSwitch(props) {
	const matches = useMediaQuery('(min-width: 800px)')

	if (!props.latLngClicked || !props.osmFeature) return null

	if (matches) return <SideSheet {...props} />

	return <ModalSheet {...props} />
}
