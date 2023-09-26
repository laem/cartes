'use client'
import Image from 'next/image'
import zoe from '@/public/voiture/zoé.jpg'
export default function Pubs() {
	return (
		<div
			css={`
				position: relative;
				height: 30rem;
				> div,
				> img {
					position: absolute;
					top: 0;
					right: 0;
				}
				img {
					width: auto;
					height: inherit;
				}
				> div {
					right: 1rem;
				}
				p {
					text-align: right;
					height: inherit;
					top: 2rem;
					right: 5rem;
					color: black;
					font-size: 260%;
					max-width: 30rem;
					line-height: 4rem;
					small {
						font-size: 75%;
					}
					em {
						font-size: 150%;
						font-style: normal;
					}
				}
				height: ;
			`}
		>
			<Image src={zoe} />
			<div>
				<p>
					Nouvelle Renault <strong>ZOE</strong>
				</p>
				<p>
					<small>Accessible dès </small>
				</p>
				<p>
					<em>88&nbsp;000 €</em>
				</p>
				<p>
					<small> sur 25 ans. </small>
				</p>
			</div>
		</div>
	)
}
