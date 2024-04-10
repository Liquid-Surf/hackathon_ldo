import Intro from './Intro';
import Step from './Step';
import Supply from './Supply';
import { Button, Typography } from '@mui/material';
import { ContainerUri } from '@ldo/solid';
import { FunctionComponent } from 'react';
import { TutorialShapeType } from '../../.ldo/tutorial.shapeTypes';
import { useLdo, useResource, useSubject } from '@ldo/solid-react';

const TutorialPage: FunctionComponent<{
  tutUri: ContainerUri;
  deleteTut?: () => void;
}> = ({ tutUri, deleteTut }) => {
  const { getResource } = useLdo();

  const tutIndexUri = `${tutUri}index.ttl`;
  const tutResource = useResource(tutIndexUri);
  const tutorial = useSubject(TutorialShapeType, tutIndexUri);

  if (tutResource.status.isError) return <p>{tutResource.status.message}</p>;

  return (
    <>
      <Intro
        title={tutorial.title}
        author={'Joe' /*TODO*/}
        date={'Monday' /*TODO*/}
        tags={tutorial.tag || []}
        images={tutorial.image || []}
        description={tutorial.description || ''}
        descriptionLong={'' /*TODO*/}
      />

      <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
        Supplies
      </Typography>
      {tutorial.hasSupply?.map((supply, index) => (
        <Supply
          key={index}
          name={supply.name || ''}
          quantity={supply.quantity + '' || ''}
          unit={supply.quantityUnit || ''}
        />
      ))}
      <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
        Steps
      </Typography>
      {tutorial.hasStep?.map((step, index) => (
        <Step
          key={index}
          title={`Step ${index}: ${step.title}` || `Step ${index}`}
          description={step.description || 'no description provided'}
          images={step.image || []}
        />
      ))}
      {deleteTut ? (
        <Button color="error" variant="contained" onClick={async () => await deleteTut()}>Delete</Button>
      ) : null}
    </>
  );
};

export default TutorialPage;
