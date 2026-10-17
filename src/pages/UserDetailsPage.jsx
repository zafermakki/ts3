import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getUserById, deleteUser } from "../services/userService";

import UserDetailsCard from "../components/users/UserDetailsCard";
import DeleteUserDialog from "../components/users/DeleteUserDialog";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      setIsLoading(true);
      setError("");
      setUser(null);

      try {
        const result = await getUserById(id);

        if (isActive) {
          setUser(result);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.message || "Failed to load user details."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isActive = false;
    };
  }, [id, reloadKey]);

  async function handleDelete() {
    if (!user || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser(user.id);

      setIsDeleteOpen(false);

      await Swal.fire({
        icon: "success",
        title: "User deleted",
        text: "The user has been removed successfully.",
        confirmButtonText: "Back to users",
      });

      navigate("/users", { replace: true });
    } catch (deleteError) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          deleteError.message ||
          "Unable to delete this user.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading user details..." />;
  }

  if (error || !user) {
    return (
      <ErrorState
        message={error || "User not found."}
        onRetry={() => setReloadKey((previous) => previous + 1)}
      />
    );
  }

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <span className="eyebrow">USER MANAGEMENT</span>
          <h1>User Details</h1>
          <p>View the complete profile and manage this user.</p>
        </div>
      </section>

      <UserDetailsCard
        user={user}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <DeleteUserDialog
        user={user}
        isOpen={isDeleteOpen}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default UserDetailsPage;