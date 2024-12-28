import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import CoursesTable from './CoursesTable';


function CoursesPage() {
  return (
    <>
      <Helmet>
        <title> Courses </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader  />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <CoursesTable />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CoursesPage;
