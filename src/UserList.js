import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://backend-goldstone.onrender.com/api/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
  };

  const toChangeInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toUpdate = async () => {
    try {
      await axios.put(
        `https://backend-goldstone.onrender.com/api/users/${editUser.id}`,
        formData
      );
      setEditUser(null);
      setFormData({
        name: "",
        email: "",
        gender: "",
        status: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toEditCancel = () => {
    setEditUser(null);
    setFormData({
      name: "",
      email: "",
      gender: "",
      status: "",
    });
  };
  const handleExport = async () => {
    try {
      await axios.get(
        "https://backend-goldstone.onrender.com/api/export-users"
      );
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };

  return (
    <div className="table-container">
      <h1>Users</h1>

      {editUser ? (
        <div>
          <h2>Edit User</h2>
          <form onSubmit={toUpdate}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={toChangeInput}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={toChangeInput}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={toChangeInput}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={toChangeInput}
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit" className="cool-button">
              Update
            </button>
            <button onClick={toEditCancel} className="cool-button">
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.status}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{new Date(user.updated_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => toEdit(user)} className="cool-button">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleExport}>Export Users</button>
    </div>
  );
};

export default UserList;
