import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Login from 'src/content/login';
import CategoryPage from './content/applications/category/CategoryPage';
import CreateCategoryPage from './content/applications/category/CreateCategory';
import EditCategory from './content/applications/category/EditeCategory';
import TeachersPage from './content/applications/Teachers/TeachersPage';
import AddTeacher from './content/applications/Teachers/AddTeacher';
import EditTeacher from './content/applications/Teachers/EditTeacher';
import CoursesPage from './content/applications/Courses/CoursesPage';
import AddCourse from './content/applications/Courses/AddCourse';
import EditCourse from './content/applications/Courses/EditCourse';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const login = Loader(lazy(() => import('src/content/login')));

// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications


const Posts = Loader(
  lazy(() => import('src/content/applications/posts'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);

// Components

const Buttons = Loader(
  lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: 'login',
        element: <Navigate to="/" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: 'posts',
        element: <Navigate to="posts" replace />
      },
     
     
    ]
  },
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="posts" replace />
      },
      ,
      {
        path: 'categories',
        element: <CategoryPage />
      },
      ,
      {
        path: 'categories/add',
        element: <CreateCategoryPage />
      },
      ,
      {
        path: 'categories/edit/:id',
        element: <EditTeacher />
      },
      {
        path: 'posts',
        element: <Posts />
      },
      {
        path: 'teachers',
        element: <TeachersPage />
      },
      {
        path: 'teachers/add',
        element: <AddTeacher />
      },
      
      {
        path: 'teachers/edit/:id',
        element: <EditTeacher />
      },
      ,
      ,
      {
        path: 'courses',
        element: <CoursesPage />
      },
      ,
      {
        path: 'courses/add',
        element: <AddCourse />
      },
      ,
      {
        path: 'courses/edit/:id',
        element: <EditCourse />
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  },
  
];

export default routes;
