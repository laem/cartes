import { useMediaQuery } from 'usehooks-ts'

export default function useIsMobile() {
	const isMobileSize = useMediaQuery('(max-width: 800px)')
	const isIframe = window.frameElement != null
	return isMobileSize && !isIframe
}
