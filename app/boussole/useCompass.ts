import { useEffect, useState } from 'react'

export default function useCompass(where) {
	const [compass, setCompass] = useState()
	const [isIOS, setIsIOS] = useState(false)

	useEffect(() => {
		setIsIOS(
			navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
				navigator.userAgent.match(/AppleWebKit/)
		)
	}, [])

	const possiblyNegativePointDegree = where
		? calcDegreeToPoint(where.latitude, where.longitude)
		: 0

	const pointDegree =
		possiblyNegativePointDegree < 0
			? possiblyNegativePointDegree + 360
			: possiblyNegativePointDegree

	const handler = (e) => {
		const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360)
		setCompass(compass)
	}

	useEffect(() => {
		const geolocationIsUndefined = navigator.geolocation == null
		if (geolocationIsUndefined) return

		if (!isIOS) {
			window.addEventListener('deviceorientationabsolute', handler, true)
		}
		return () => {
			if (!isIOS) {
				window.removeEventListener('deviceorientationabsolute', handler, true)
			}
		}
	}, [isIOS])

	const startCompass = () => {
		if (isIOS) {
			try {
				DeviceOrientationEvent.requestPermission()
					.then((response) => {
						if (response === 'granted') {
							window.addEventListener('deviceorientation', handler, true)
						} else {
							console.error('Device orientation was not allowed!')
						}
					})
					.catch(() => console.error('Device orientation not supported'))
			} catch (e) {
				console.error('Device orientation not supported', e)
			}
		}
	}

	useEffect(() => {
		startCompass()
	}, [startCompass])
	return [compass, pointDegree]
}
function calcDegreeToPoint(latitude, longitude) {
	// The code block checks whether the compass heading is within ±15 degrees of a predefined point (pointDegree). This is likely used to determine if the device is pointing in the right direction with a margin of error of 15 degrees.
	// https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
	//
	// We set Vierzon's geolocation, close to the center of the french hexagon
	// but we're not really using this feature
	const point = {
		lat: 47.21917,
		lng: 2.07564,
	}

	const phiK = (point.lat * Math.PI) / 180.0
	const lambdaK = (point.lng * Math.PI) / 180.0
	const phi = (latitude * Math.PI) / 180.0
	const lambda = (longitude * Math.PI) / 180.0
	const psi =
		(180.0 / Math.PI) *
		Math.atan2(
			Math.sin(lambdaK - lambda),
			Math.cos(phi) * Math.tan(phiK) -
				Math.sin(phi) * Math.cos(lambdaK - lambda)
		)
	return Math.round(psi)
}
