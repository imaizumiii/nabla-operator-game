export default function Modal({ message, onClose, children, selectedOperator }) {
    console.log("Modal描画中");
    
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center",
            zIndex: 1000,
        }}>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-lg text-center min-w-[300px]">
                <p>{message}</p>
                <div>
                    {children}
                </div>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={onClose} >
                    キャンセル
                </button>
            </div>
        </div>
    );
}