import './index.css'

export default function Dialog(props: { title: string, text: string, isOpen: boolean, onReject: ()=>void, onAccept: ()=>void }) {
	if (!props.isOpen) return (null);
	return (
		<div className="ui__ dialog-wrapper">
			<div className="ui__ dialog">
				<h5 className="ui__ dialog-title">{props.title}</h5>
				<p className="ui__ dialog-text">{props.text}</p>
				<div className="ui__ dialog-action">
					<button onClick={props.onReject} className="ui__ dialog-reject">Refuser</button>
					<button onClick={props.onAccept} className="ui__ dialog-accept">Accepter</button>
				</div>
			</div>
		</div>
	)
}
