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

  return (
    <Router>
      <Header />
        <Routes>
      {session.isLoggedIn &&  mainContainer ? (
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
        </Routes>
      ) : null}
    </Router>
  );
};

export default Routing;
