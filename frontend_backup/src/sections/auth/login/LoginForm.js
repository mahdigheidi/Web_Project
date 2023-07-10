import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import account from '../../../_mock/account';
// ----------------------------------------------------------------------

export default function LoginForm(props) {
  const navigate = useNavigate();

  // const [showPassword, setShowPassword] = useState(false);

  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };
  // const navigate = useNavigate();

  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const database = [
    {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'pass1'
    },
    {
      username: 'user2',
      email: 'user2@gmail.com',
      password: 'pass2'
    }
  ];

  const errors = {
    uname: 'invalid username',
    pass: 'invalid password'
  };

  const [uname, setName] = useState('')
  const [pass, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/login/", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credintials': 'true'
      },
      credentials:'include',
      body: JSON.stringify({
        "username": uname,
        "password": pass
      })
    })

    const content = await response.json()
    if (response.ok) {
      setIsSubmitted(true);
      account.displayName = content.username;
      props.Setuname(content.username)
      // account.email = userData.email;
    }

    // const userData = database.find((user) => user.username === uname.value);

    // if (userData) {
    //   if (userData.password !== pass.value) {
    //     setErrorMessages({ name: 'pass', message: errors.pass });
    //   } else {
    //     setIsSubmitted(true);
    //     account.displayName = userData.username;
    //     account.email = userData.email;
    //   }
    // } else {
    //   setErrorMessages({ name: 'uname', message: errors.uname });
    // }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
        <label htmlFor="btn-check5" className="btn btn-primary-border">
            <input placeholder='email' type="text" name="uname" required
              onChange={e => setName(e.target.value)} />
          </label>
          {renderErrorMessage('uname')}
        </div>
        <div className="input-container">
        <label htmlFor="btn-check5" className="btn btn-primary-border">
            <input placeholder="password" type="password" name="pass" required
              onChange={e => setPassword(e.target.value)} />
          </label>
          {renderErrorMessage('pass')}
        </div>
        <div className="button-container">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );

  return (
    
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? (
          navigate('/dashboard/weekly_view')
          // <div>User is successfully logged in</div>
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
}

  // return (
  //   <>
  //     <Stack spacing={3}>
  //       <TextField name="email" label="Email address" />

  //       <TextField
  //         name="password"
  //         label="Password"
  //         type={showPassword ? 'text' : 'password'}
  //         InputProps={{
  //           endAdornment: (
  //             <InputAdornment position="end">
  //               <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
  //                 <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
  //               </IconButton>
  //             </InputAdornment>
  //           ),
  //         }}
  //       />
  //     </Stack>

  //     <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
  //       <Checkbox name="remember" label="Remember me" />
  //       <Link variant="subtitle2" underline="hover">
  //         Forgot password?
  //       </Link>
  //     </Stack>

  //     <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
  //       Login
  //     </LoadingButton>
  //   </>
  // );
// }
