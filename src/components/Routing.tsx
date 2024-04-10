import React, { FunctionComponent, useEffect, useState } from 'react';
import { Header } from './Header';
import TutorialRoute from './tutorialPage/TutorialRoute';
import { ListTuts } from './ListTuts';
import { ContainerUri } from '@ldo/solid';
import { Container } from '@mui/material';

import { Create } from './Create';
import { useLdo, useResource, useSolidAuth } from '@ldo/solid-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const Routing: FunctionComponent = () => {
  const { getResource } = useLdo();
  const { session } = useSolidAuth();
  const [mainContainerUri, setMainContainerUri] = useState<
    ContainerUri | undefined
  >();

  const mainContainer = useResource(mainContainerUri);

  useEffect(() => {
    if (session.webId) {
      const webIdResource = getResource(session.webId);
      webIdResource.getRootContainer().then((rootContainerResult) => {
        if (rootContainerResult.isError) return;
        const mainContainer = rootContainerResult.child('tutorials/');
        setMainContainerUri(mainContainer.uri);
        if (mainContainerUri) mainContainer.createIfAbsent();
      });
    }
  }, [getResource, session.webId]);

  const welcome =  
  <>
    <h3>
    	Welcome to my project for the <a href="https://solidhack.org">Solid Mini-hackathon 2024</a>
    </h3>

    <p>
    	On this website you can create and view the tutorial that you have hosted on your Pod. 
    	Therefor, you need a pod to use this app, you can create one here: <a href="https://pod.liquid.surf">pod.liquid.surf</a>
    </p>
    <h3>Usage</h3>
    <p>
    <ol>
      <li>Login with you pod</li>
      <li>Create a tutorial on the "Create" page</li>
      <li>View the list of tutorial on the Home page or "My tutorals" page</li>
      <li>Click on the tutorial preview to see the full tutorial</li>
      <li>You can delete a tutorial clicking the "Delete" button at the end of a tutorial page</li>
    </ol>
    	
    </p>

    </>
    

  return (
    <Router>
      <Header />
        <Routes>
      {session.isLoggedIn &&  mainContainer ? (
        <>
          <Route
            path="/"
            element={
              <Container>
                <ListTuts mainContainer={mainContainer} />
              </Container>
            }
          />
          <Route
            path="/create"
            element={
              <Container>
                <Create mainContainer={mainContainer} />
              </Container>
            }
          />
          <Route
            path="/myprojects"
            element={
              <Container>
                <ListTuts mainContainer={mainContainer} />
              </Container>
            }
          />
          <Route
            path="/project/:tutUri"
            element={
              <Container>
                <TutorialRoute />
              </Container>
            }
          />
        </>
      ) : 

        <Route
          path="/"
          element={
            <Container>
              {welcome}
            </Container>
          }
        />
       }
        </Routes>
    </Router>
  );
};

export default Routing;
