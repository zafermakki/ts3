import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";

function UserTable({ users, onDelete }) {
  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Contact</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const fullName =
              `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

            return (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <img
                      className="user-avatar"
                      src={user.image}
                      alt={fullName}
                      loading="lazy"
                    />

                    <div className="user-cell-info">
                      <Link
                        to={`/users/${user.id}`}
                        className="user-name-link"
                      >
                        {fullName || "Unnamed User"}
                      </Link>

                      <span className="user-id">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="contact-cell">
                    <span className="contact-line">
                      <Mail size={15} />
                      {user.email || "No email"}
                    </span>

                    <span className="contact-line">
                      <Phone size={15} />
                      {user.phone || "No phone"}
                    </span>
                  </div>
                </td>

                <td>{user.age ?? "—"}</td>

                <td>
                  <span
                    className={`gender-badge ${
                      user.gender === "female" ? "female" : "male"
                    }`}
                  >
                    {user.gender
                      ? user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)
                      : "—"}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <Link
                      to={`/users/${user.id}`}
                      className="icon-button view-action"
                      title="View details"
                      aria-label={`View ${fullName}`}
                    >
                      <Eye size={17} />
                    </Link>

                    <Link
                      to={`/users/${user.id}/edit`}
                      className="icon-button edit-action"
                      title="Edit user"
                      aria-label={`Edit ${fullName}`}
                    >
                      <Pencil size={17} />
                    </Link>

                    <button
                      type="button"
                      className="icon-button delete-action"
                      title="Delete user"
                      aria-label={`Delete ${fullName}`}
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;