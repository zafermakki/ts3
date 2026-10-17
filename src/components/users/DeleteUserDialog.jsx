import { AlertTriangle, Trash2, X } from "lucide-react";

function DeleteUserDialog({
  user,
  isOpen,
  isDeleting = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen || !user) {
    return null;
  }

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <span className="dialog-warning-icon">
          <AlertTriangle size={27} />
        </span>

        <h2 id="delete-dialog-title">Delete User?</h2>

        <p id="delete-dialog-description">
          Are you sure you want to delete{" "}
          <strong>{fullName || "this user"}</strong>?
          This action will remove the user from your dashboard.
        </p>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="button-spinner" />
            ) : (
              <Trash2 size={17} />
            )}

            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteUserDialog;