import React from "react"
import { Link } from "react-router-dom"
import { encodeRuleName } from "Engine/rules"
import classNames from "classnames"
import { capitalise0 } from "../../utils"
let fmt = new Intl.NumberFormat("fr-FR").format
export let humanFigure = decimalDigits => value =>
	fmt(value.toFixed(decimalDigits))
import "./RuleValueVignette.css"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

export default ({
	name,
	type,
	titre,
	conversationStarted,
	nodeValue: ruleValue
}) =>
	do {
		let unsatisfied = ruleValue == null,
			irrelevant = ruleValue == 0,
			number = typeof ruleValue == "number" && ruleValue > 0
		;<span
			key={name}
			className={classNames("RuleValueVignette", {
				unsatisfied,
				irrelevant,
				number
			})}
		>
			<Link to={"/regle/" + encodeRuleName(name)}>
				<div className="rule-box">
					<span className="rule-name">{titre || capitalise0(name)}</span>
					<RuleValue
						{...{ unsatisfied, irrelevant, conversationStarted, ruleValue }}
					/>
				</div>
			</Link>
		</span>
	}

let RuleValue = ({ unsatisfied, irrelevant, conversationStarted, ruleValue }) =>
	do {
		let [className, text] = irrelevant
			? ["irrelevant", "Vous n'êtes pas concerné"]
			: unsatisfied
				? ["unsatisfied", "En attente de vos réponses..."]
				: ["figure", humanFigure(2)(ruleValue) + " €"]

		{
			/*<p><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Pourquoi ?</em></p> */
		}

		<ReactCSSTransitionGroup
			transitionName="flash"
			transitionEnterTimeout={100}
			transitionLeaveTimeout={100}
		>
			<span key={text} className="rule-value">
				{" "}
				{conversationStarted && <span className={className}>{text}</span>}
			</span>
		</ReactCSSTransitionGroup>
	}
