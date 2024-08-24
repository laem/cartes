import useSetSearchParams from '@/components/useSetSearchParams'
import closeIcon from '@/public/remove-circle-stroke.svg'
import addIcon from '@/public/add-circle-stroke.svg'
import { Reorder, useDragControls } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { removeStatePart, setAllezPart } from '../SetDestination'

export default function Steps({ state, setDisableDrag = () => null }) {
	const steps = state

	const setSearchParams = useSetSearchParams()

	if (!steps?.length) return null

	const allez = steps.map((step) => step?.key).join('->')

	return (
		<section
			css={`
				margin: 0.6rem 0 2.6rem 0;
			`}
		>
			<AddStepButton
				url={setSearchParams({ allez: '->' + allez }, true)}
				title={'Ajouter un point comme départ'}
			/>
			<Reorder.Group
				axis="y"
				values={steps.map((step) => step?.key)}
				onReorder={(newItems) =>
					setSearchParams({ allez: newItems.join('->') })
				}
				css={`
					width: 100%;
					background: var(--lightestColor);
					border-radius: 0.4rem;
					padding: 0.2rem 0.3rem;
					list-style-type: none;
					li {
						padding: 0.3rem 0.4rem;
						border-bottom: 1px solid var(--lighterColor);
						background: var(--lightestColor);
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
					li:last-child {
						border-bottom: none;
					}
				`}
			>
				{steps.map((step, index) => (
					<Item
						key={step?.key}
						{...{
							index,
							step,
							setSearchParams,
							beingSearched: isStepBeingSearched(steps, index),
							state,
							setDisableDrag,
						}}
					/>
				))}
			</Reorder.Group>
			<AddStepButton
				url={setSearchParams({ allez: allez + '->' }, true)}
				title={'Ajouter un point comme destination'}
			/>
		</section>
	)
}
const AddStepButton = ({ url, title }) => (
	<div
		css={`
			display: flex;
			align-items: center;
			justify-content: end;
			height: 1.8rem;
		`}
	>
		<Link
			href={url}
			title={title}
			css={`
				text-decoration: none;
				margin: 0rem 0.7rem;
				display: inline-block;
				opacity: 0.7;
			`}
		>
			<Image
				src={addIcon}
				alt="Supprimer cette étape"
				css={`
					width: 1.2rem;
					height: auto;
					vertical-align: sub;
				`}
			/>
		</Link>
	</div>
)

const Item = ({
	index,
	step,
	setSearchParams,
	beingSearched,
	state,
	setDisableDrag,
}) => {
	const controls = useDragControls()
	const [undoValue, setUndoValue] = useState(null)
	const key = step?.key
	return (
		<Reorder.Item
			key={key}
			value={key}
			dragListener={false}
			dragControls={controls}
			css={`
				${beingSearched &&
				`
				background: yellow !important;
				`}
			`}
		>
			<div
				css={`
					display: flex;
					justify-content: start;
					align-items: center;
					> span {
						line-height: 1.4rem;
					}
				`}
			>
				<Icon text={letterFromIndex(index)} />{' '}
				<span
					onClick={() => {
						step && setUndoValue(step.key)
						setSearchParams({
							allez: setAllezPart(step.key, state, ''),
						})
					}}
					css="min-width: 6rem; cursor: text"
				>
					{beingSearched
						? `Choisissez une ${index == 0 ? 'origine' : 'destination'}`
						: step?.name || '...'}
				</span>
				{undoValue != null && beingSearched && (
					<span>
						{' '}
						<button
							onClick={() =>
								setSearchParams({
									allez: setAllezPart(step.key, state, undoValue),
								})
							}
						>
							<Image
								src="/close.svg"
								width="10"
								height="10"
								alt="Icône croix"
								css={`
									margin-left: 0.4rem;
									filter: invert(1);
								`}
							/>{' '}
							annuler
						</button>
					</span>
				)}
			</div>
			<div
				css={`
					&,
					a {
						display: flex;
						align-items: center;
					}
					> a {
						margin-left: 0.4rem;
					}
				`}
			>
				{key ? (
					<div
						onPointerDown={(e) => {
							setDisableDrag(true)
							controls.start(e)
						}}
						onPointerUp={(e) => {
							setDisableDrag(false)
						}}
						className="reorder-handle"
					>
						<Dots />
					</div>
				) : (
					<div
						css={`
							width: 1.6rem;
						`}
					></div>
				)}
				<RemoveStepLink {...{ setSearchParams, stepKey: key, state }} />
			</div>
		</Reorder.Item>
	)
}

const RemoveStepLink = ({ setSearchParams, stepKey, state }) => {
	if (!stepKey)
		return (
			<div
				css={`
					width: 1.6rem;
				`}
			></div>
		)
	return (
		<Link
			href={setSearchParams({ allez: removeStatePart(stepKey, state) }, true)}
		>
			<Image
				src={closeIcon}
				alt="Supprimer cette étape"
				css={`
					width: 1.2rem;
					height: auto;
				`}
			/>
		</Link>
	)
}

const Icon = ({ text }) => (
	<span
		css={`
			display: inline-block;
			margin: 0 0.4rem 0 0;
			background: var(--color);
			color: white;
			width: 1.4rem;
			text-align: center;
			height: 1.4rem;
			line-height: 1.4rem;
			border-radius: 2rem;
		`}
	>
		{text}
	</span>
)

const Dots = () => (
	<span
		css={`
			cursor: pointer;
			display: inline-flex;
			width: 1.4rem;
			height: 1.4rem;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			span {
				display: block;
				background: var(--color);
				width: 5px;
				border-radius: 5px;
				height: 5px;
				margin: 1px;
			}
		`}
	>
		{[...new Array(9)].map((_, index) => (
			<span key={index}></span>
		))}
	</span>
)

export const letterFromIndex = (index) => String.fromCharCode(65 + (index % 26))

const isStepBeingSearched = (steps, index) => {
	if (steps.length === 2 && steps.every((step) => !step || !step.key))
		return index === 1
	const foundSearched = steps.findIndex(
		(step) => step && !step.key && step.inputValue
	)
	if (foundSearched > -1) return foundSearched === index

	return steps.findIndex((step) => step === null) === index
}

export const hasStepBeingSearched = (steps) => {
	return steps.some((step) => step === null || (!step.key && step.inputValue))
}
