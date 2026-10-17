import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useUsers } from "../hooks/useUsers";

import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import UserPagination from "../components/users/UserPagination";
import DeleteUserDialog from "../components/users/DeleteUserDialog";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const PAGE_SIZE = 10;

function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search filters from the URL.
  const searchQuery = searchParams.get("search") ?? "";
  const gender = searchParams.get("gender") ?? "";

  const pageParam = searchParams.get("page");
  const parsedPage = Number(pageParam ?? "1");

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // Reusable custom hook for fetching and deleting users.
  const {
    users,
    isLoading,
    error,
    refresh,
    removeUser,
  } = useUsers({
    search: searchQuery,
    gender,
  });

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalUsers = users.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalUsers / PAGE_SIZE)
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const currentPageUsers = users.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Keep the URL page number valid if the number of results changes.
  useEffect(() => {
    if (isLoading || pageParam === null) {
      return;
    }

    const requestedPage = Number(pageParam);

    let correctedPage = requestedPage;

    if (
      !Number.isInteger(requestedPage) ||
      requestedPage < 1
    ) {
      correctedPage = 1;
    } else if (requestedPage > totalPages) {
      correctedPage = totalPages;
    }

    if (correctedPage !== requestedPage) {
      const params = new URLSearchParams(searchParams);

      if (correctedPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(correctedPage));
      }

      setSearchParams(params, { replace: true });
    }
  }, [
    isLoading,
    pageParam,
    totalPages,
    searchParams,
    setSearchParams,
  ]);

  // Update a URL parameter and reset pagination.
  function updateFilterParam(key, value) {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    setSearchParams(params, { replace: true });
  }

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(searchParams);

    params.delete("search");
    params.delete("gender");
    params.delete("page");

    setSearchParams(params, { replace: true });
  }

  async function handleDeleteUser() {
    if (!userToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await removeUser(userToDelete.id);

      setUserToDelete(null);

      await Swal.fire({
        icon: "success",
        title: "User deleted",
        text: "The user has been removed successfully.",
        confirmButtonText: "Continue",
      });
    } catch (deleteError) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          deleteError.message ||
          "Unable to delete this user. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const hasActiveFilters = Boolean(searchQuery || gender);

  return (
    <div className="page-content">
      <section className="page-heading">
        <div className="page-heading-content">
          <span className="eyebrow">USER MANAGEMENT</span>

          <h1>Users Dashboard</h1>

          <p>
            View, search, update, and manage your users.
          </p>
        </div>
      </section>

      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={(value) =>
          updateFilterParam("search", value)
        }
        gender={gender}
        onGenderChange={(value) =>
          updateFilterParam("gender", value)
        }
        totalUsers={totalUsers}
      />

      {isLoading ? (
        <LoadingState message="Loading users..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      ) : totalUsers === 0 ? (
        <div className="table-panel">
          <EmptyState
            title={
              hasActiveFilters
                ? "No matching users"
                : "No users available"
            }
            description={
              hasActiveFilters
                ? "Try changing your search or filters."
                : "There are no users to display right now."
            }
            isSearchResult={hasActiveFilters}
          />

          {hasActiveFilters && (
            <div className="empty-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="table-panel">
          <UserTable
            users={currentPageUsers}
            onDelete={setUserToDelete}
          />

          <div className="table-footer">
            <span>
              Showing {startIndex + 1}–
              {Math.min(startIndex + PAGE_SIZE, totalUsers)} of{" "}
              {totalUsers} users
            </span>
          </div>

          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DeleteUserDialog
        user={userToDelete}
        isOpen={Boolean(userToDelete)}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setUserToDelete(null);
          }
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}

export default UsersPage;