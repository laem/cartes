import { useEffect } from 'react'
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export default function useKeypress(
	key: string,
	action: Function,
	hookConditions
) {
	useEffect(() => {
		function onKeyup(e) {
			if (e.key === key) action()
		}
		window.addEventListener('keyup', onKeyup)
		return () => window.removeEventListener('keyup', onKeyup)
	}, hookConditions)
}
