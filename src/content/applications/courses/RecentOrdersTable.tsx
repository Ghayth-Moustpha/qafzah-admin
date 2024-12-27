import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
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
  Divider
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

interface ICourse {
  id: number;
  title: string;
  description: string;
  teacher: string;
  cost: number;
  type: string;
  createdAt: string;
}

interface CourseTableProps {
  courses: ICourse[];
}

const applyPagination = (
  courses: ICourse[],
  page: number,
  limit: number
): ICourse[] => {
  return courses.slice(page * limit, page * limit + limit);
};

const CoursesTable: FC<CourseTableProps> = ({ courses }) => {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const theme = useTheme();

  const handleSelectAllCourses = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCourses(
      event.target.checked ? courses.map((course) => course.id) : []
    );
  };

  const handleSelectOneCourse = (
    event: ChangeEvent<HTMLInputElement>,
    courseId: number
  ): void => {
    if (!selectedCourses.includes(courseId)) {
      setSelectedCourses((prevSelected) => [...prevSelected, courseId]);
    } else {
      setSelectedCourses((prevSelected) =>
        prevSelected.filter((id) => id !== courseId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedCourses = applyPagination(courses, page, limit);
  const selectedSomeCourses =
    selectedCourses.length > 0 && selectedCourses.length < courses.length;
  const selectedAllCourses = selectedCourses.length === courses.length;

  return (
    <Card>
      <CardHeader title="Courses List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCourses}
                  indeterminate={selectedSomeCourses}
                  onChange={handleSelectAllCourses}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourses.map((course) => {
              const isCourseSelected = selectedCourses.includes(course.id);
              return (
                <TableRow
                  hover
                  key={course.id}
                  selected={isCourseSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCourseSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCourse(event, course.id)
                      }
                      value={isCourseSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {course.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>{course.type}</TableCell>
                  <TableCell align="right">{course.cost}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{
                        '&:hover': {
                          background: theme.colors.primary.lighter
                        },
                        color: theme.palette.primary.main
                      }}
                      size="small"
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        '&:hover': { background: theme.colors.error.lighter },
                        color: theme.palette.error.main
                      }}
                      size="small"
                    >
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={courses.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

CoursesTable.propTypes = {
  courses: PropTypes.array.isRequired
};

CoursesTable.defaultProps = {
  courses: []
};

export default CoursesTable;
