import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'

const ModalSheet = dynamic(() => import('./ModalSheet'), {
	ssr: true,
})
const SideSheet = dynamic(() => import('./SideSheet'), {
	ssr: true,
})

export default function ModalSwitch(props) {
	const isNotMobile = useMediaQuery('(min-width: 800px)')

	if (isNotMobile) return <SideSheet {...props} />

	return <ModalSheet {...props} />
}

/*
Alternatives : https://github.com/helgastogova/react-stateful-bottom-sheet?ref=hackernoon.com
https://github.com/helgastogova/react-stateful-bottom-sheet?ref=hackernoon.com
bof

mieux : https://github.com/plrs9816/slick-bottom-sheet/

https://codesandbox.io/s/framer-motion-bottom-sheet-for-desktop-with-drag-handle-ov8e0o

https://swipable-modal.vercel.app
*/
