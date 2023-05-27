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
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://backend-goldstone.onrender.com/api/users`
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (loading) {
    return (
      <div className="load">
        Loading...please wait fetching data onrender slow
      </div>
    );
  }
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

  const toDelete = async (id) => {
    try {
      await axios.delete(
        `https://backend-goldstone.onrender.com/api/users/${id}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toAdd = async () => {
    try {
      const res = await axios.post(
        `https://backend-goldstone.onrender.com/api/users`,
        formData
      );
      const newUser = res.data;
      setFormData({
        name: "",
        email: "",
        gender: "",
        status: "",
      });
      fetchUsers();
      setUsers([newUser, ...users]);
      alert("added successfully in userList");
      console.log(newUser);
    } catch (error) {
      console.error("Error adding user:", error);
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

  const toExport = async () => {
    try {
      await axios.get(
        `https://backend-goldstone.onrender.com/api/export-users`
      );
      alert("Export to CSV successful!");
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setFormData({
      name: "",
      email: "",
      gender: "",
      status: "",
    });
  };

  return (
    <div className="table-container">
      <h1>Users List</h1>

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
        <>
          <div className="button-container">
            <button onClick={toggleAddForm} className="cool-button add-button">
              Add User
            </button>
            <button onClick={toExport}>Export to CSV</button>
          </div>

          {showAddForm && (
            <div>
              <h2>Add User</h2>
              <form onSubmit={toAdd}>
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
                  Add
                </button>
                <button onClick={toggleAddForm} className="cool-button">
                  Cancel
                </button>
              </form>
            </div>
          )}

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
                <th>Delete</th>
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
                    <button
                      onClick={() => toEdit(user)}
                      className="cool-button"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => toDelete(user.id)}
                      className="cool-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserList;
