import { SearchX, Users } from "lucide-react";

function EmptyState({
  title = "No users found",
  description = "Try changing your search or filter.",
  isSearchResult = false,
}) {
  const Icon = isSearchResult ? SearchX : Users;

  return (
    <div className="state-container empty-state">
      <span className="state-icon empty-icon">
        <Icon size={32} />
      </span>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;