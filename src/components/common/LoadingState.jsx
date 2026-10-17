import { LoaderCircle } from "lucide-react";

function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <LoaderCircle className="loading-spinner" size={36} />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;