import { FunctionComponent, useCallback, useMemo } from "react";
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

;
import { ContainerUri, LeafUri } from "@ldo/solid";
import { TutorialShapeType } from "../.ldo/tutorial.shapeTypes"
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { Navigate, useNavigate } from 'react-router-dom';


const TutorialPreview: FunctionComponent<{ tutUri: ContainerUri }> = ({ tutUri }) => {
    const navigate = useNavigate();

  const tutIndexUri = `${tutUri}index.ttl`;
  const tutResource = useResource(tutIndexUri);
  const tutorial = useSubject(TutorialShapeType, tutIndexUri)
	if (tutResource.status.isError) 
  	return <p>{tutResource.status.message}</p>

  const handlePreviewClick = () => {
    console.log("URI", tutUri)
    const tutId = tutUri.split('/').slice(-2,-1)
    navigate(`/project/${encodeURIComponent(tutUri)}`)
  }

   return (
    <Card sx={{ maxWidth: 345 , cursor: 'pointer'}} onClick={handlePreviewClick}>
      <CardMedia
        component="img"
        height="140"
        image={tutorial.image?.[0] || ''}
        alt={tutorial.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {tutorial.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tutorial.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TutorialPreview;