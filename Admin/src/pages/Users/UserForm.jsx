import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUser(data);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(id, user);
    navigate("/users");
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit User Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                value={user.username}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                value={user.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                value={user.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={user.address}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mr: 2, "&:hover": { bgcolor: "primary.dark" } }}
              >
                Update
              </Button>
              <Button
                component={Link}
                to="/users"
                variant="outlined"
                sx={{ "&:hover": { bgcolor: "grey.100" } }}
              >
                Back to Users
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
