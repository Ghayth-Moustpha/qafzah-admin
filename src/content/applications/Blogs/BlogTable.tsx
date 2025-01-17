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
import { Link } from 'react-router-dom';
import { IBlog } from './blogs.interface';
import "./index.css" ;
import { useAuth } from 'src/contexts/AuthContext';



const applyPagination = (blogs: IBlog[], page: number, limit: number): IBlog[] =>
  blogs.slice(page * limit, page * limit + limit);

const BlogTable: FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const {API} = useAuth () ; 
  const theme = useTheme();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedBlogs(event.target.checked ? blogs.map((b) => b.id) : []);
  };

  const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, id: number): void => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  function createMarkup(content: any) {
    return {
       __html: content  };
 }; 

  const paginatedBlogs = applyPagination(blogs, page, limit);

  return (
    <Card>
      <CardHeader title="Blog List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedBlogs.length > 0 && selectedBlogs.length < blogs.length
                  }
                  checked={selectedBlogs.length === blogs.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlogs.map((blog) => (
              <TableRow key={blog.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={(event) => handleSelectOne(event, blog.id)}
                  />
                </TableCell>
                <TableCell>
                  <img src={API +blog.imageURL} width={100} alt="Blog" />
                </TableCell>
                <TableCell>
                  <Typography  variant="body1" fontWeight="bold" noWrap>
                    {blog.title}
                  </Typography>
                </TableCell>
        
                <TableCell align="right">
                  <Link to={`./edit/${blog.id}`}>
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
          count={blogs.length}
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

export default BlogTable;
