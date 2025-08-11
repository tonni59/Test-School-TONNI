// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import "./Navbar.css";

const AvatarFallback = ({ name }: { name?: string }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  return <div className="avatar-fallback">{initials}</div>;
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => {
    setOpen(false);
    navigate("/edit-profile");
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = auth.user;
  const avatarSrc = user?.profilePhoto || "";

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">TONNI School Project</Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    className={location.pathname === "/login" ? "active" : ""}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={
                      location.pathname === "/register" ? "active" : ""
                    }
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li>
                  <Link
                    to="/exam/1"
                    className={
                      location.pathname.startsWith("/exam") ? "active" : ""
                    }
                  >
                    Exam
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className={
                        location.pathname === "/admin/dashboard"
                          ? "active"
                          : ""
                      }
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/analytics"
                    className={
                      location.pathname === "/analytics" ? "active" : ""
                    }
                  >
                    Analytics
                  </Link>
                </li>

                {/* Profile Dropdown */}
                <li
                  className="profile-dropdown"
                  ref={dropdownRef}
                >
                  <div
                    className="profile-trigger"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        className="profile-avatar"
                      />
                    ) : (
                      <AvatarFallback name={user.name} />
                    )}
                  </div>

                  {open && (
                    <div className="profile-menu">
                      <div className="profile-info">
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt="Profile"
                            className="profile-avatar-large"
                          />
                        ) : (
                          <AvatarFallback name={user.name} />
                        )}
                        <div>
                          <strong>{user.name}</strong>
                          <div>{user.email}</div>
                          <div>{user.phone}</div>
                        </div>
                      </div>
                      <hr />
                      <button
                        className="edit-btn"
                        onClick={handleEditProfile}
                      >
                        ✏ Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="logout-btn"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
