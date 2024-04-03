import { useEffect, useState, useCallback, Fragment, FunctionComponent } from "react";
import { Create  } from './Create';
import  TutorialPage  from './tutorialPage/TutorialPage'
import  TutorialPreview from './TutorialPreview'

import { useLdo, useSolidAuth } from "@ldo/solid-react";
import { Container } from "@ldo/solid";
import { Grid } from '@mui/material';


export const ListTuts: FunctionComponent<{ mainContainer: Container}> =  ({
  mainContainer
}) => {
  const { session } = useSolidAuth();
  const { getResource} = useLdo();

  const [tutorials, setTutorials] = useState<Array<Container>>([]);

	useEffect(() => {
  	if (mainContainer) {
    	setTutorials(mainContainer?.children()
    	 .filter((child): child is Container => child.type === "container"))
  	}
	}, [mainContainer])



  const deleteTut = useCallback( async (tutUri: string) => {
    const tutContainer = getResource(tutUri);
    await tutContainer.delete();
    setTutorials( oldTutorials => oldTutorials.filter(tut => tut.uri != tutUri ) )
  }, [tutorials, getResource]);

  return (
	    <Grid container spacing={2} justifyContent="center" sx={{marginTop: 5}}>
			{tutorials.map((tut, index) => {
	            return (
		        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
					<TutorialPreview 
						key={tut.uri}
	          	 		tutUri={tut.uri} 
	          	 		/>
				</Grid>
	        	  )
	      	 })}
	    </Grid>
  );
}

