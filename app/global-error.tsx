'use client' // Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		// global-error must include html and body tags
		<html>
			<body>
				<h1>Oups, une erreur est survenue :(</h1>
				<button onClick={() => reset()}>Réessayer (au cas où)</button>
			</body>
		</html>
	)
}
