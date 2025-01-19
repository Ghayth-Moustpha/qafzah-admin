import { FC, useState, useEffect, ChangeEvent } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Divider,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from 'src/hooks/axios';
import { useAuth } from 'src/contexts/AuthContext';
import { Consultation } from './consultation.interface';

const applyPagination = (consultation: Consultation[], page: number, limit: number): Consultation[] =>
  consultation.slice(page * limit, page * limit + limit);

const ConsultationsTable: FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [deleteId, setDeleteId] = useState<string | null>(null); // For modal management
  const theme = useTheme();
  const { API } = useAuth();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axiosInstance.get('consultations');
        setConsultations(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchConsultations();
  }, []);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await axiosInstance.delete(`consultations/${deleteId}`);
        setConsultations((prev) => prev.filter((cons) => cons.id !== deleteId));
        setDeleteId(null); // Close the modal
      } catch (error) {
        console.error('Error deleting consultation:', error);
      }
    }
  };

  const paginatedConsultations = applyPagination(consultations, page, limit);

  return (
    <Card>
      <CardHeader title="Consultations List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedConsultations.map((cons) => (
              <TableRow key={cons.id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {cons.name}
                  </Typography>
                </TableCell>
                <TableCell>{cons.email}</TableCell>
                <TableCell>{cons.message}</TableCell>
                <TableCell>{new Date(cons.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    sx={{ color: theme.palette.error.main }}
                    size="small"
                    onClick={() => setDeleteId(cons.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={consultations.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleLimitChange}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this consultation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ConsultationsTable;
