import pubs from './pubs.yaml'

export default function PubImages() {
	return pubs.map((data) => (
		<img
			src={`/api/cout-voiture-image?titre=${data.titre}&image=${
				data.image
			}&situation=${encodeURIComponent(JSON.stringify(data.situation))}`}
		/>
	))
}
