import "../styles/autoLoginModal.css";

export default function AutoLoginModal({ visible, name, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h1 className="modal-title">使用此裝置登入？</h1>

        <p className="modal-username">{name}</p>

        <p className="modal-desc">
          系統偵測到此裝置已綁定帳戶，可直接登入。
        </p>

        <div className="modal-buttons">
          <button className="modal-btn confirm" onClick={onConfirm}>
            確定登入
          </button>

          <button className="modal-btn cancel" onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
