import { FormEvent, FunctionComponent, useCallback, useState, useRef, useEffect } from 'react';
import { Container, Leaf, LeafUri, SolidLdoDataset } from "@ldo/solid";
import { useLdo, useResource, useSubject, useSolidAuth } from "@ldo/solid-react"
import { commitTransaction, createLdoDataset, getDataset, parseRdf, startTransaction, transactionChanges } from "@ldo/ldo"
import { TutorialShapeType } from "../.ldo/tutorial.shapeTypes"
// import tutorialShacl  from '../.shapes/tutorial.json'
import tutorialShacl  from '../.shapes/tutorial.json'
import { literal, quad, namedNode } from "@rdfjs/data-model";
import { Quad, Quad_Object, Dataset } from "@rdfjs/types"
import { SolidProfileShapeShapeType } from "../.ldo/solidProfile.shapeTypes";

import { v4 } from "uuid";


import GenericThingForm from './GenericThingForm';
import { AlignVerticalTop, Tune } from '@mui/icons-material';
import { Container as MuiContainer, FormControl } from '@mui/material';





export const Create: FunctionComponent<{ mainContainer: Container}> =  ({
  mainContainer
}) => {
  const { session } = useSolidAuth();
	const { dataset, getResource } = useLdo();
	const [formResult, setFormResult] = useState('');
	const [images, setImages] = useState<Array<[File, string]>>([])
	const [uploadImages, setUploadedImages] = useState<Array<Leaf>>([])

	const webId = session?.webId 
  // const webIdResource = useResource(session.webId);
  // const profile = useSubject(SolidProfileShapeShapeType, session.webId);
  // const loggedName = webIdResource?.isReading() ?
  //  "LOADING..."
  //  : profile?.fn ?
  //  profile.fn
  //  : session.webId;
	// TODO useCallback ??
  const createResourceContainer = async (parentContainer: Container, containerName? : string  )  =>  {
    if ( ! containerName ) 
      containerName = `${v4()}/`
    if ( containerName.slice(-1) != '/' )
      containerName += '/'

  	const tutContainerResult = await parentContainer.createChildAndOverwrite(
  		containerName
  	);
  	if (tutContainerResult.isError){
  		alert(tutContainerResult.message);
  		return;
  	}
  	return tutContainerResult.resource as Container
  }


  const rawTurtleToLdoDataset = async (rawTurtle: string, targetResourceUrl: string ): Promise<Dataset<Quad, Quad>|undefined> => {
			try {

        const rawTurtleDataset = await parseRdf(rawTurtle, {
          baseIRI: targetResourceUrl,
        });
      const resourceGraph = namedNode(targetResourceUrl + "index.ttl");
      const formDataset = rawTurtleDataset.map((q) => {
				if ( q.predicate.value && q.predicate.value === "http://example.org/image"  ){
  				// We're trying to clean up the file path by replacing the fake path prefix 
        // added by web browsers when selecting a file, with the actual resource URI.
  				const imgUri = literal(q.object.value.replace('C:\\fakepath\\', `${targetResourceUrl}images/`))

  				return quad(q.subject, q.predicate, imgUri, resourceGraph)
				}
 					
        return quad(q.subject, q.predicate, q.object, resourceGraph)
      }
      );

      return formDataset;
			}catch(e){
  			console.log("ERROR parsing from RDF", e)
  			return 
			}
}



	// const resourceContainer = await createResourceContainer(mainContainer)
  const addFormResultToLoggedUserPod = useCallback(async (rawTurtle: string) => {
		const tutorialMainContainerResource =  await createResourceContainer(mainContainer)
		if ( tutorialMainContainerResource === undefined ) 
  		return;
		const tutorialMainResource = tutorialMainContainerResource.child("index.ttl") 

		const formDataset = await rawTurtleToLdoDataset(rawTurtle, tutorialMainContainerResource.uri)
		if (!formDataset)
  		return;

    const transaction = dataset.startTransaction();
    transaction.addAll(formDataset);
    const result = await transaction.commitToPod();
    if (result.isError) console.log("Error:", result.message);


    // upload images

    const imageContainer = await createResourceContainer(tutorialMainContainerResource, 'images/')
    images.map(async ([file, destinationFolder], index) => {
      console.log("uploading file", file)
      if (file && imageContainer) {
        const result = await imageContainer.uploadChildAndOverwrite(
          file.name as LeafUri,
          file,
          file.type
        );
        if (result.isError) {
          alert(result.message);
          await imageContainer.delete();
          return;
        }
        setUploadedImages([...uploadImages, result.resource]);
       }
    });
    // Set Wac rules
    const resource = dataset
    	.getResource(tutorialMainContainerResource.uri)
    console.log("WEBID", webId?.split('#')[0])
    const wacRes = await resource
      .setWac({
        public: {
          read: true,
          write: false,
          append: false,
          control: false
        },
        authenticated: { 
          // This is too permissive 
          // but only way I have found to both create 
          // and delete resource, didn't work otherwise
          read: true,
          write: true,
          append: true,
          control: true
        },
        agent: {
          webId: {
            read: true,
            write: true,
            append: true,
            control: true
          }
        }
      });


  }, [images, formResult]);

	const getImageFile = (e: any, destinationFolder: string = "") => {
  	console.log("type e", e.type)
  	console.log("IMAGE SET", e);
  	const file = e.target.files?.[0]
  	if (file) {
    	const result = mainContainer
    	setImages(prevImages => [...prevImages, [file, destinationFolder]])
    	console.log("file added to list")
    	console.log(images)
  	}else{
    	console.log("No file nor image to be uploaded in the following event:", e)
  	}
  	console.log("file",file)
  	console.log("name", file.name)
  	console.log("type", file.type)
  	console.log("images array", images)
	}
	return (
    <>
      <h1> Create a new Tutorial </h1>
      	{
        session.isLoggedIn  ? 
        	<GenericThingForm 
        		id="createTutorial"
        		dataSubmitButton=""
        		shape={tutorialShacl.shape}
        		callbackRdfFormResult={addFormResultToLoggedUserPod}
        		getFile={getImageFile}
        		/>
        	 : <p> Log in to create a tutorial </p>
      	}
    </>
	)


}
