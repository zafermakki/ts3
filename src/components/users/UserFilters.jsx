import { Search, Filter, X } from "lucide-react";

function UserFilters({
  searchQuery,
  onSearchChange,
  gender,
  onGenderChange,
  totalUsers,
}) {
  function clearFilters() {
    onSearchChange("");
    onGenderChange("");
  }

  const hasActiveFilters = Boolean(searchQuery || gender);

  return (
    <section className="filters-panel">
      <div className="filters-heading">
        <div>
          <h2>All Users</h2>
          <p>
            Manage and view your users in one place.
          </p>
        </div>

        <span className="users-count">
          {totalUsers} {totalUsers === 1 ? "user" : "users"}
        </span>
      </div>

      <div className="filters-controls">
        <div className="search-input-wrapper">
          <Search size={19} className="input-icon" />

          <input
            type="search"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search users"
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="filter-select-wrapper">
          <Filter size={18} />

          <select
            value={gender}
            onChange={(event) => onGenderChange(event.target.value)}
            aria-label="Filter users by gender"
          >
            <option value="">All genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-outline clear-filters-btn"
            onClick={clearFilters}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

export default UserFilters;