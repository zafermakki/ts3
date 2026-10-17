import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import Swal from "sweetalert2";

import {
  getUserById,
  updateUser,
} from "../services/userService";

import UserForm from "../components/users/UserForm";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            requestError.message || "Failed to load user."
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

  async function handleUpdateUser(userData) {
    if (!user || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser(id, userData, user);

      await Swal.fire({
        icon: "success",
        title: "Changes saved",
        text: "The user information has been updated.",
        confirmButtonText: "View User",
      });

      navigate(`/users/${id}`, { replace: true });
    } catch (requestError) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          requestError.message ||
          "Unable to update user. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading user information..." />;
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
      <Link
        to={`/users/${id}`}
        className="back-link page-back-link"
      >
        <ArrowLeft size={18} />
        Back to user details
      </Link>

      <section className="page-heading">
        <div>
          <span className="eyebrow">USER MANAGEMENT</span>
          <h1>Edit User</h1>
          <p>
            Update the information for {user.firstName}{" "}
            {user.lastName}.
          </p>
        </div>

        <span className="heading-icon">
          <Pencil size={27} />
        </span>
      </section>

      <div className="form-panel">
        <UserForm
          initialValues={user}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateUser}
          onCancel={() => navigate(`/users/${id}`)}
        />
      </div>
    </div>
  );
}

export default EditUserPage;