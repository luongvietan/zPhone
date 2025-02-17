import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../services/userService";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUser(data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        p: 2,
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              User Details
            </Typography>
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2 }}>Username: {user.username}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Phone: {user.phone}</Typography>
        <Typography>Address: {user.address}</Typography>
      </CardContent>
      <Button component={Link} to="/users" variant="contained" sx={{ mt: 2 }}>
        Back to Users
      </Button>
    </Card>
  );
};

export default UserDetail;
