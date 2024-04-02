import React, { FunctionComponent, useEffect, useState  } from 'react';
import logo from './logo.svg';
import { Header } from './Header';
import TutorialRoute from './tutorialPage/TutorialRoute'
import { ListTuts }  from './ListTuts';
import { ContainerUri } from "@ldo/solid";
import { Container } from '@mui/material';

import { Create } from './Create';
import { BrowserSolidLdoProvider } from '@ldo/solid-react';
import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

export const Routing: FunctionComponent = () => {

  const { getResource} = useLdo();
  const { session } = useSolidAuth();
  const [mainContainerUri, setMainContainerUri] = 
  	useState<ContainerUri|undefined>();

  const mainContainer = useResource(mainContainerUri);

  useEffect(() => {
    if(session.webId){
      	const webIdResource = getResource(session.webId);
      	webIdResource.getRootContainer().then(
        	(rootContainerResult) => {
          	if (rootContainerResult.isError) return;
          	const mainContainer = rootContainerResult.child("otat/");
          	setMainContainerUri(mainContainer.uri);
            if(mainContainerUri){
              	mainContainer.createIfAbsent();
            }else{
                console.log("Coulnd fetch mainContainer")
            }

        	})
    }
  }, [getResource, session.webId])


  return (
    <>

          <Router>
        	<Header />
           <Routes>
            <Route path="/" element={mainContainer ? <Container><ListTuts  mainContainer={mainContainer }/></Container> : null} />
        <Route path="/create" element={mainContainer ? <Container><Create mainContainer={mainContainer} /></Container> : null} />
            <Route path="/myprojects" element={mainContainer ? <Container><ListTuts mainContainer={mainContainer}  /></Container> : null} />
                <Route path="/project/:tutUri" element={mainContainer ? <Container><TutorialRoute/></Container> : null} />
          </Routes>
          </Router>

    </>
  );
}

export default Routing;
