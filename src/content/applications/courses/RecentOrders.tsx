import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/hooks/axios';

function RecentOrders() {
  const [Courses,setCourses] =useState ()
  useEffect( ()=>{
    const getCourses = async ()=>{
      await axiosInstance.get("courses").then ((res)=>{
        setCourses(res.data)
      }).catch(error=> console.log(error)) ;
      
    }
    getCourses() ;
  } , [])
  return (
    <Card>
      <RecentOrdersTable courses ={Courses} />
    </Card>
  );
}

export default RecentOrders;