// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const icon1 = (name) => <SvgColor src={`/assets/icons/navbar/${name}.png`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Daily View',
    path: '/dashboard/daily_view',
    icon: icon1('daily'),
  },
  {
    title: 'Weekly View',
    path: '/dashboard/weekly_view',
    icon: icon1('7-days')
  },
  {
    title:'Monthly View',
    path: '/dashboard/monthly_view',
    icon: icon1('30-days')
  },
  {
    title: 'My Bookings',
    path: '/dashboard/my_bookings',
    icon: icon1('booking')
  },
  {
    title: 'Search Room',
    path: '/dashboard/search_room',
    icon: icon1('search')
  },
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'User',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  // {
  //   title: 'Login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  {
    title: 'Sign Up',
    path: '/sign_up',
    icon: icon1('signup'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
