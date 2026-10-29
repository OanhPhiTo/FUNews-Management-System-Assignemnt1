/**
 * Author: OanhTP
 */
function Modal({ isOpen, onClose, title, children, isLarge = false }) {
  if (!isOpen) return null;

  // Ngăn click bên trong modal box làm đóng modal (Event Bubbling)
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box ${isLarge ? 'modal-box-large' : ''}`}
        onClick={handleContentClick}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
