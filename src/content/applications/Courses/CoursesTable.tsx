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
import axiosInstance from 'src/hooks/axios';
import { useAuth } from 'src/contexts/AuthContext';
import { Link } from 'react-router-dom';

// Define ICreateCourse interface
export interface ICreateCourse {
  title: string;
  description: string;
  teacherId: number;
  cost?: number;
  type?: string;
  imageUrl?: string;
  categories: number[];
  startDate: Date; // Renamed from startData to startDate for consistency
  hours: number;
}

const applyPagination = (courses: ICreateCourse[], page: number, limit: number): ICreateCourse[] =>
  courses.slice(page * limit, page * limit + limit);

const CoursesTable: FC = () => {
  const [courses, setCourses] = useState<ICreateCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const theme = useTheme();
  const { API } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await axiosInstance.get('courses').then((res) => {
          setCourses(res.data);
          console.log(res.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCourses(event.target.checked ? courses.map((course) => course.teacherId) : []);
  };

  const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, id: number): void => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const paginatedCourses = applyPagination(courses, page, limit);

  return (
    <Card>
      <CardHeader title="Course List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedCourses.length > 0 && selectedCourses.length < courses.length}
                  checked={selectedCourses.length === courses.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourses.map((course) => (
              <TableRow key={course.teacherId} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedCourses.includes(course.teacherId)}
                    onChange={(event) => handleSelectOne(event, course.teacherId)}
                  />
                </TableCell>
                <TableCell>
                  <img src={`${API}${course.imageUrl}`} width={100} alt="Course" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {course.title}
                  </Typography>
                </TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.teacherId}</TableCell>
                <TableCell>{course.cost}</TableCell>
                <TableCell>{new Date(course.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Link to={`./edit/${course.teacherId}`}>
                    <IconButton sx={{ color: theme.palette.primary.main }} size="small">
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
          count={courses.length}
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

export default CoursesTable;
