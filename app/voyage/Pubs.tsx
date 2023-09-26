'use client'
import Image from 'next/image'
import zoe from '@/public/voiture/zoé.jpg'
export default function Pubs() {
	return (
		<div
			css={`
				position: relative;
				height: 30rem;
				> * {
					position: absolute;
				}
				img {
					width: auto;
					height: inherit;
					top: 0;
					left: 0;
				}
				div {
					height: inherit;
					top: 2rem;
					right: 5rem;
					color: black;
					font-size: 300%;
					max-width: 20rem;
					line-height: 3rem;
				}
				height: ;
			`}
		>
			<Image src={zoe} />
			<div>Pour seulement 88&nbsp;000 € sur 25 ans</div>
		</div>
	)
}
