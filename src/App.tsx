import React, { FunctionComponent, useEffect, useState  } from 'react';
import logo from './logo.svg';
import { Header } from './components/Header';
import { ListTuts }  from './components/ListTuts';
import { ContainerUri, Container } from "@ldo/solid";

import { Create } from './components/Create';
import { BrowserSolidLdoProvider } from '@ldo/solid-react';
import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import Routing from './components/Routing'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';

function App() {

  // const { getResource} = useLdo();
  // const { session } = useSolidAuth();
  const [mainContainerUri, setMainContainerUri] = 
  	useState<ContainerUri|undefined>();
  const [mainContainer, setMainContainer] = 
  	useState<Container|undefined>();


  // useEffect(() => {
  //   if(session.webId){
  //     	const webIdResource = getResource(session.webId);
  //     	webIdResource.getRootContainer().then(
  //       	(rootContainerResult) => {
  //         	if (rootContainerResult.isError) return;
  //         	const mainContainer = rootContainerResult.child("otat/");
  //         	setMainContainerUri(mainContainer.uri);
  //       	  setMainContainer(useResource(mainContainerUri))
  //         	mainContainer.createIfAbsent();
  //       	})
  //   }
  // }, [getResource, session.webId])

  return (
    <>
      <div className="App">
        <BrowserSolidLdoProvider>
          <Routing />
      	</BrowserSolidLdoProvider>
      </div>
    </>
  );
}

export default App;
