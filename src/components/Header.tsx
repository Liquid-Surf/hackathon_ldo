import { FunctionComponent } from "react";
import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { SolidProfileShapeShapeType } from "../.ldo/solidProfile.shapeTypes";
import { AppBar, Toolbar, Typography, Button, Container, Link as MuiLink } from '@mui/material';
import logo from '../logo.svg';
import {
  Link
} from 'react-router-dom';

export const Header: FunctionComponent = () => {
  const { session, login, logout } = useSolidAuth();
  const webIdResource = useResource(session.webId);
  const profile = useSubject(SolidProfileShapeShapeType, session.webId);
  const loggedName = webIdResource?.isReading() ?
   "LOADING..."
   : profile?.fn ?
   profile.fn
   : "";
   return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="none">Home</MuiLink>
          </Typography>

          <Typography>
            <MuiLink component={Link} to="/myprojects" color="inherit" sx={{ marginRight: 3 }} underline="none">My Tutorials</MuiLink>
          </Typography>
          <Typography>
            <MuiLink component={Link} to="/create" color="inherit" sx={{ marginRight: 3 }} underline="none">Create Tutorial</MuiLink>
          </Typography>          
          {session.isLoggedIn ? (
            <Typography>
              <a href={session.webId}>Hello {loggedName}</a>
              <Button color="inherit" onClick={logout}>Log Out</Button>
            </Typography>
          ) : (
            <Typography>
              <Button color="inherit"
                onClick={() => {
                  const issuer = prompt("Enter your Solid Issuer", "http://localhost:3055");
                  if (!issuer) return;
                  login(issuer);
                }}
              >
                Log In
              </Button>
            </Typography>
          )}
        </Toolbar>
      </Container>
    </AppBar>
   )
  // return (
  //   <header>
  //     <nav>
  //       <ul>
  //         <li><Link to="/">Home</Link></li>
  //         <li><Link to="/create">Create a new Project</Link></li>
  //         <li><Link to="/myprojects">Your project</Link></li>
  //       </ul>
  //     </nav>
  //     <p>Header</p>
  //     {session.isLoggedIn ? (
  //       // Is the session is logged in
  //       <p>
  //         You are logged in with the webId {session.webId}.{" "}
  //         Hello {loggedName}
  //         <button onClick={logout}>Log Out</button>
  //       </p>
  //     ) : (
  //       // If the session is not logged in
  //       <p>
  //         You are not Logged In{" "}
  //         <button
  //           onClick={() => {
  //             // Get the Solid issuer the user should log into
  //             const issuer = prompt(
  //               "Enter your Solid Issuer",
  //               "http://localhost:3055"
  //             );
  //             if (!issuer) return;
  //             login(issuer);
  //           }}
  //         >
  //           Log In
  //         </button>
  //       </p>
  //     )}
  //     <hr />
  //   </header>
  // );
};


