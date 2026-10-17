import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import Swal from "sweetalert2";

import { createUser } from "../services/userService";
import UserForm from "../components/users/UserForm";

function AddUserPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateUser(userData) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdUser = await createUser(userData);

      await Swal.fire({
        icon: "success",
        title: "User created",
        text: "The user has been added successfully.",
        confirmButtonText: "View User",
      });

      navigate(`/users/${createdUser.id}`, {
        replace: true,
      });
    } catch (requestError) {
      await Swal.fire({
        icon: "error",
        title: "Creation failed",
        text:
          requestError.message ||
          "Unable to create user. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-content">
      <Link to="/users" className="back-link page-back-link">
        <ArrowLeft size={18} />
        Back to users
      </Link>

      <section className="page-heading">
        <div>
          <span className="eyebrow">USER MANAGEMENT</span>
          <h1>Add New User</h1>
          <p>Create a new user by completing the form below.</p>
        </div>

        <span className="heading-icon">
          <UserPlus size={28} />
        </span>
      </section>

      <div className="form-panel">
        <UserForm
          submitLabel="Create User"
          isSubmitting={isSubmitting}
          onSubmit={handleCreateUser}
          onCancel={() => navigate("/users")}
        />
      </div>
    </div>
  );
}

export default AddUserPage;