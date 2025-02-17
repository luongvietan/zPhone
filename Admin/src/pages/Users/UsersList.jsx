import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Delete, Visibility, Edit, Search } from "@mui/icons-material";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/users/${id}`)
        .then(() => setUsers(users.filter((user) => user.id !== id)))
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 1000, margin: "auto", mt: 4, boxShadow: 3 }}
    >
      <TextField
        fullWidth
        placeholder="Search users..."
        variant="outlined"
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Username
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Phone
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold" }}
              align="center"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell align="center">
                <IconButton
                  component={Link}
                  to={`/users/${user._id}`}
                  color="primary"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  component={Link}
                  to={`/users/edit/${user._id}`}
                  color="warning"
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersList;
