import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="state-container error-state" role="alert">
      <span className="state-icon error-icon">
        <AlertCircle size={32} />
      </span>

      <h3>Unable to load data</h3>
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onRetry}
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;