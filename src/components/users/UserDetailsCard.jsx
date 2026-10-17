import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserRound,
  Building2,
} from "lucide-react";

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-item-icon">
        <Icon size={18} />
      </span>

      <div>
        <span className="detail-label">{label}</span>
        <p className="detail-value">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function UserDetailsCard({ user, onDelete }) {
  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  const address = user.address
    ? [
        user.address.address,
        user.address.city,
        user.address.state,
        user.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <section className="details-card">
      <Link to="/users" className="back-link">
        <ArrowLeft size={18} />
        Back to users
      </Link>

      <div className="details-profile">
        <img
          className="details-avatar"
          src={user.image}
          alt={fullName}
        />

        <div className="details-profile-info">
          <span className="eyebrow">USER PROFILE</span>
          <h2>{fullName || "Unnamed User"}</h2>

          <p className="details-username">
            @{user.username || "unknown"}
          </p>

          <span
            className={`gender-badge ${
              user.gender === "female" ? "female" : "male"
            }`}
          >
            {user.gender || "Gender not specified"}
          </span>
        </div>

        <div className="details-profile-actions">
          <Link
            to={`/users/${user.id}/edit`}
            className="btn btn-primary"
          >
            <Pencil size={17} />
            Edit User
          </Link>

          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={onDelete}
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="details-section">
          <h3>Personal Information</h3>

          <div className="details-grid">
            <DetailItem
              icon={Mail}
              label="Email Address"
              value={user.email}
            />

            <DetailItem
              icon={Phone}
              label="Phone Number"
              value={user.phone}
            />

            <DetailItem
              icon={Calendar}
              label="Age"
              value={user.age != null ? `${user.age} years` : ""}
            />

            <DetailItem
              icon={UserRound}
              label="Gender"
              value={user.gender}
            />

            <DetailItem
              icon={UserRound}
              label="Username"
              value={user.username}
            />

            <DetailItem
              icon={MapPin}
              label="Address"
              value={address}
            />
          </div>
        </div>

        {user.company && (
          <div className="details-section">
            <h3>Professional Information</h3>

            <div className="details-grid">
              <DetailItem
                icon={Building2}
                label="Company"
                value={user.company.name}
              />

              <DetailItem
                icon={Building2}
                label="Department"
                value={user.company.department}
              />

              <DetailItem
                icon={Building2}
                label="Job Title"
                value={user.company.title}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserDetailsCard;