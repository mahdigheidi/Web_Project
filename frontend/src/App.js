import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {

  const [uname, Setuname] = useState('')

  useEffect(() => {
        fetch("http://localhost:8080/check_user/", {
          method: "GET", 
          credentials:'include',
          // mode:'no-cors'
        }).then((response) => {
          response.json().then((content) => {
            Setuname(content.username)
          })
        }).catch((err) => window.alert(err.message));
  },[]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router uname={uname} Setuname={Setuname}/>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
