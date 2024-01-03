export default function Pouete({ src }) {
	return (
		<iframe
			src={src}
			className="mastodon-embed"
			width="400"
			allowfullscreen="allowfullscreen"
		></iframe>
	)
}
