export const backgroundConferenceAnimation = `
					@keyframes gradient {
						0% {
							background-position: 0% 50%;
						}
						50% {
							background-position: 100% 50%;
						}
						100% {
							background-position: 0% 50%;
						}
					}
					background: linear-gradient(
						90deg,
						white -10%,
						var(--color) 10%,
						#b71540 90%,
						white 110%
					);
					background-size: 400% 400%;
					animation: gradient 15s ease infinite;
					`
