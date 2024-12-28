import { FC, useState, useEffect, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
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

interface ICategory {
  id: number;
  name: string;
  description: string;
  imageURL: string;
}

const applyPagination = (categories: ICategory[], page: number, limit: number): ICategory[] =>
  categories.slice(page * limit, page * limit + limit);

const CategoryTable: FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const theme = useTheme();
  const {API} = useAuth(); 
  useEffect(() =>  {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCategories(event.target.checked ? categories.map((c) => c.id) : []);
  };

  const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, id: number): void => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const paginatedCategories = applyPagination(categories, page, limit);

  return (
    <Card>
      <CardHeader title="Category List" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                  checked={selectedCategories.length === categories.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(event) => handleSelectOne(event, category.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell><img src={`${API}${category.imageURL}`}  width={200}/></TableCell> 
                
                <TableCell align="right">
                  <Link to ={`./edite/${category.id}`}> 
                  
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
          count={categories.length}
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

CategoryTable.propTypes = {
  categories: PropTypes.array
};

CategoryTable.defaultProps = {
  categories: []
};

export default CategoryTable;
