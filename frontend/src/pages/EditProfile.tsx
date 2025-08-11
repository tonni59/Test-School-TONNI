import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { updateUserProfileAsync } from "../store/slices/authSlice";

import "./EditProfile.css";

const EditProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(updateUserProfileAsync(formData));
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Avatar */}
        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setAvatar(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {/* Save Button */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
