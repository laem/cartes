export default function isWebglSupported() {
	if (window.WebGLRenderingContext) {
		const canvas = document.createElement('canvas')
		try {
			// Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
			// to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
			// for more details.
			const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
			if (context && typeof context.getParameter == 'function') {
				return true
			}
		} catch (e) {
			// WebGL is supported, but disabled
		}
		return false
	}
	// WebGL not supported
	return false
}
