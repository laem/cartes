'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<div
			css={`
				background: var(--darkColor);
				color: white;
			`}
		>
			<h2>Oups, une erreur est survenue :(</h2>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Réessayer (au cas où)
			</button>
		</div>
	)
}
