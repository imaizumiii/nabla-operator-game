import { useState } from "react";
import Modal from "./Modal";

export default function CountSelectModal({ onClose, onExecute }) {
    const [diffCount, setDiffCount] = useState(0);
    const [intCount, setIntCount] = useState(0);
    return (
        <Modal message="何回適用しますか？" onClose={onClose}>
            <div className="flex m-2 justify-center items-center gap-2 dark:bg-gray-800">
                <p className="m-0">微分 :</p>
                <button className="py-1 m-0 bg-gray rounded-none hover:bg-gray-300 border border-gray-300" onClick={() => diffCount > 0 ? setDiffCount(diffCount - 1) : setDiffCount(0)}>-</button>
                <input
                    type="text"
                    value={diffCount}
                    readOnly
                    className="m-0 w-12 text-center border bg-white dark:bg-gray-700 dark:text-white"
                />
                <button className="py-1 m-0 rounded-none hover:bg-gray-300 border border-gray-300" onClick={() => setDiffCount(diffCount + 1)}>+</button>
            </div>
            <div className="flex justify-center items-center gap-2 dark:bg-gray-800 p-3 rounded-lg">
                <p className="m-0">積分 :</p>
                <button className="m-0 py-1 bg-gray rounded-none hover:bg-gray-300 border border-gray-300" onClick={() => intCount > 0 ? setIntCount(intCount - 1) : setIntCount(0)}>-</button>
                <input
                    type="text"
                    value={intCount}
                    readOnly
                    className="m-0 w-12 text-center border bg-white dark:bg-gray-700 dark:text-white"
                />
                <button className="py-1 m-0 rounded-none hover:bg-gray-300 border border-gray-300" onClick={() => setIntCount(intCount + 1)}>+</button>
            </div>
            <button className="px-4 py-2 mb-4 bg-gray-200 rounded" onClick={() => {onExecute();}}>適用</button>
        </Modal>
    )
}