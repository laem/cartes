export default function ClickedPoint({ clickedPoint: { lat, lon, data } }) {
	return (
		<div>
			{lat} {lon}
		</div>
	)
}
