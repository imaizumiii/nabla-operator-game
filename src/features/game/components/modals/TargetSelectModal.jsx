import Modal from "./Modal";

export default function TargetSelectModal({ onClose, onExecute}) {
    return (
        <Modal message="誰に適用しますか？" onClose={onClose}>
            <button className="m-4" onClick={() => {onExecute("player"); onClose();}}>自分</button>
            <button className="m-4" onClick={() => {onExecute("opponent"); onClose();}}>相手</button>
        </Modal>
    );
}