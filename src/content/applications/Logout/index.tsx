import React, { useEffect } from 'react';
import { Button, Typography, Box, Container, Grid, Card, CardHeader, Divider, CardContent } from '@mui/material'; // Ensure '@mui/material' is correctly imported
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageTitle from 'src/components/PageTitle';
import Footer from 'src/components/Footer';

const Logout: React.FC = () => {
  const { logout } = useAuth(); // Use the logout function from context
  const navigate = useNavigate();

  // Perform logout only once when the component mounts
  useEffect(() => {
    logout(); // Clear user and token
  }, [logout]);

  const handleNavigateToLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
    <Helmet>
      <title>Logout - Qafzah</title>
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
            <Box>
        <Typography variant="h4" gutterBottom>
          Goodbye!
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have successfully logged out.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToLogin}
          sx={{ mt: 3 }}
        >
          Go to Login
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
};

export default Logout;
