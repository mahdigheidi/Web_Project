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
    (
      async () => {
        const response = await fetch("http://localhost:8080/check_user/", {
          method: "GET", 
          credentials:'include',
          // mode:'no-cors'
        })

        const content = await response.json()

        Setuname(content.username)

      }
    )()
  })

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
