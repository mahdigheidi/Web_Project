import { Navigate, useRoutes } from 'react-router-dom';
import Cookies from 'js-cookie'
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DailyViewPage2 from './pages/DailyViewPage2'
import WeeklyViewPage from './pages/WeeklyViewPage';
import MonthlyViewPage from './pages/MonthlyViewPage';
import SearchRoomPage from './pages/SearchRoomPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SignUpPage from './pages/SignUpPage';

// ----------------------------------------------------------------------

export default function Router(props) {
  console.log(props);
  console.log("hi", props.uname)
  const routes = useRoutes([
    // {
    //   path: '/',

    // }
    {
      path: 'dashboard',
      element: <DashboardLayout Setuname={props.Setuname} />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        // { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
        { path: 'daily_view', element: <DailyViewPage2 /> },
        { path: 'weekly_view', element: <WeeklyViewPage /> },
        { path: 'monthly_view', element: <MonthlyViewPage /> },
        { path: 'my_bookings', element: <MyBookingsPage /> },
        { path: 'search_room', element: <SearchRoomPage /> },
      ],
    },
    {
      path: 'login',
      element: Cookies.get("jwt") ? <Navigate to="/dashboard/weekly_view" /> : <LoginPage Setuname={props.Setuname} />,
      // children: [
      //   { path: 'sign_up', element: <SignUpPage />}
      // ]
    },
    {
      path: 'sign_up',
      element: Cookies.get("jwt") ? <Navigate to="/dashboard/weekly_view" /> : <SignUpPage />
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
