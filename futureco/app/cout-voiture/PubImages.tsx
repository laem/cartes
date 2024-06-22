import convert from 'Components/css/convertToJs'
import pubs from './pubs.yaml'

export default function PubImages() {
	return pubs.map((data) => (
		<img
			style={convert(`margin: 2rem auto; width: 90%; display: block`)}
			src={`/api/cout-voiture-image?titre=${data.titre}&image=${
				data.image
			}&situation=${encodeURIComponent(JSON.stringify(data.situation))}`}
		/>
	))
}
