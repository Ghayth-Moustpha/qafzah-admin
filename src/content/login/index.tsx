import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import { useState } from 'react';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Box,
  TextField,
  Typography,
} from '@mui/material';
import Footer from 'src/components/Footer';
import { Navigate } from 'react-router';
import { useAuth } from 'src/contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { sginin, token } = useAuth(); // Consolidate useAuth usage

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    sginin(email, password);
  };

  // Redirect if token exists
  if (token) {
    console.log(token);
    return <Navigate to="/dashboards" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Login - Qafzah</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Login" subHeading="Access to Qafzah Admin panel" />
      </PageTitleWrapper>
      <Container>
        <Grid container justifyContent="center" alignItems="center">
          <Grid>
            <Card>
              <CardHeader title="Login" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { mb: 2 } }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Typography variant="h3" align="center">Welcome</Typography>
                  <TextField
                    required
                    id="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
