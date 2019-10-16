import React from 'react'
import emoji from 'react-easy-emoji'
export default () => (
	<section className="ui__ container" id="about">
		<h1>L'impact climat de ce que j'ai mangé aujourd'hui</h1>
		<ul
			css={`
				border-left: 10px solid var(--colour);
				padding-left: 2rem;
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				height: 80vh;
				justify-content: space-evenly;

				> li {
					line-height: 3rem;
					background: var(--lighterColour);
					border-radius: 0.6rem;
					border: 2px solid var(--colour);
					padding-left: 1rem;
					width: 20rem;
					list-style-type: none;
				}
			`}>
			<li>
				<div>Mon petit-déjeuner</div>
				<input placeholder="Qu'avez-vous mangé ?" />
				<ul>
					{[
						'bol de céréales',
						'tartines beurre ou confiture',
						'croissant 🥐 ou pain au chocolat',
						'café',
						'thé'
					].map(nom => (
						<li>
							{emoji(nom)}
							<img
								width="20px"
								src="https://icon-library.net/images/co2-icon/co2-icon-9.jpg"
							/>
						</li>
					))}
				</ul>
			</li>
			<li>Mon repas du midi</li>
			<li>Mon repas du soir</li>
		</ul>
	</section>
)
