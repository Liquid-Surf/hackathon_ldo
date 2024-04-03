import { useEffect, useState, FunctionComponent } from 'react';
import TutorialPreview from './TutorialPreview';

import { Container } from '@ldo/solid';
import { Grid } from '@mui/material';

export const ListTuts: FunctionComponent<{ mainContainer: Container }> = ({
  mainContainer,
}) => {
  const [tutorials, setTutorials] = useState<Array<Container>>([]);

  useEffect(() => {
    if (mainContainer) {
      setTutorials(
        mainContainer
          .children()
          .filter((child): child is Container => child.type === 'container')
      );
    }
  }, [mainContainer]);

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 5 }}>
      {tutorials.map((tut) => (
        <Grid item key={tut.uri} xs={12} sm={6} md={4} lg={3}>
          <TutorialPreview tutUri={tut.uri} />
        </Grid>
      ))}
    </Grid>
  );
};
