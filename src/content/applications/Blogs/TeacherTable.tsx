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
  Checkbox,
  IconButton,
  Typography,
  useTheme,
  CardHeader,
  Divider,
  Box
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axiosInstance from 'src/hooks/axios';
import { useAuth } from 'src/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ITeacher } from './teacher.interface';

const applyPagination = (teachers: ITeacher[], page: number, limit: number): ITeacher[] =>
  teachers.slice(page * limit, page * limit + limit);

const TeacherTable: FC = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const theme = useTheme();
  const { API } = useAuth();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        await axiosInstance.get('teachers').then ((res) => {
          setTeachers(res.data);
          console.log(res.data);
        });
       
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
  }, []);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedTeachers(event.target.checked ? teachers.map((t) => t.id) : []);
  };

  const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, id: number): void => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const paginatedTeachers = applyPagination(teachers, page, limit);

  return (
    <Card>
      <CardHeader title="Teacher List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedTeachers.length > 0 && selectedTeachers.length < teachers.length
                  }
                  checked={selectedTeachers.length === teachers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Image</TableCell>

              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTeachers.map((teacher) => (
              <TableRow key={teacher.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedTeachers.includes(teacher.id)}
                    onChange={(event) => handleSelectOne(event, teacher.id)}
                  />
                </TableCell>
                <TableCell>
                  <img src={`${API}${teacher.image}`} width={100} alt="Teacher" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {teacher.fname}
                  </Typography>
                </TableCell>
                <TableCell>{teacher.lname}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.bio}</TableCell>
              
                <TableCell align="right">
                  <Link to={`./edit/${teacher.id}`}>
                    <IconButton
                      sx={{ color: theme.palette.primary.main }}
                      size="small"
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={teachers.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleLimitChange}
        />
      </Box>
    </Card>
  );
};

export default TeacherTable;
