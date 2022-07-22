// Thanks https://codepen.io/kamerat/pen/rRwMMq

export default ({ children }) => (
	<div
		css={`
			margin-top: 1rem;
			@media (max-width: 800px) {
				padding: 0rem;
			}
			max-width: 30rem;
			.top {
				display: flex;
				align-items: center;
				flex-direction: column;
				.title {
					font-weight: normal;
					font-size: 1.6em;
					text-align: left;
					margin-left: 20px;
					margin-bottom: 50px;
					color: #fff;
				}
				.printer {
					width: 100%;
					height: 20px;
					border: 5px solid #fff;
					border-radius: 10px;
					box-shadow: 1px 3px 3px 0px rgba(0, 0, 0, 0.2);
				}
			}

			.receipts-wrapper {
				overflow: hidden;
				margin-top: -10px;
				padding-bottom: 10px;
			}

			.receipts {
				width: 100%;
				display: flex;
				align-items: center;
				flex-direction: column;
				transform: translateY(-800px);

				animation-duration: 2.5s;
				animation-delay: 100ms;
				animation-name: print;
				animation-fill-mode: forwards;

				.receipt {
					background: black;
					text-align: left;
					min-height: 200px;
					width: 88%;
					border-radius: 10px 10px 20px 20px;
					box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);
					border: 0.1rem solid white;
				}
			}

			@keyframes print {
				0% {
					transform: translateY(-800px);
				}
				50% {
					transform: translateY(-350px);
				}
				100% {
					transform: translateY(-10px);
				}
			}
		`}
	>
		<div class="top">
			<div class="printer" />
		</div>
		<div class="receipts-wrapper">
			<div class="receipts">
				<div class="receipt">{children}</div>
			</div>
		</div>
	</div>
)
