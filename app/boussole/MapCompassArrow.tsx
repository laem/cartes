import useCompass from './useCompass'

export default function MapCompassArrow() {
	const [compass] = useCompass()
	return (
		<div
			css={`
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				z-index: 20;
				filter: drop-shadow(0 0 0.75rem white);
				border-style: solid;
				border-width: 12px 6px 0 6px;
				border-color: red transparent transparent transparent;
				${compass != null
					? `
transform: translate(-50%, -50%) rotate(${compass}deg) !important;`
					: ''}
			`}
		></div>
	)
}
