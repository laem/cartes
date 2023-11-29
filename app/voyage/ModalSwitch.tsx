import { useLocalStorage, useMediaQuery } from 'usehooks-ts'
import dynamic from 'next/dynamic'
import useTraceComponentUpdate from '@/components/utils/useTraceComponentUpdate'

const ModalSheet = dynamic(() => import('./ModalSheet'), {
	ssr: false,
})
const SideSheet = dynamic(() => import('./SideSheet'), {
	ssr: true,
})

export default function ModalSwitch(props) {
	const matches = useMediaQuery('(min-width: 800px)')

	//	useTraceComponentUpdate(props)

	const [tutorials] = useLocalStorage('tutorials', {})

	if (tutorials.introduction && !props.isSheetOpen) return null

	if (matches) return <SideSheet {...props} />

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
