import { Link, NavLink } from "react-router-dom";
import { Users, UserPlus, LayoutDashboard } from "lucide-react";

function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/users" className="brand">
          <span className="brand-icon">
            <Users size={24} />
          </span>

          <span className="brand-text">
            <strong>UserHub</strong>
            <small>User Management</small>
          </span>
        </Link>

        <nav className="header-nav">
          <NavLink
            to="/users"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Users</span>
          </NavLink>

          <Link to="/users/add" className="btn btn-primary header-add-btn">
            <UserPlus size={18} />
            <span>Add User</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;