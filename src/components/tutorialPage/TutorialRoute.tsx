import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TutorialPage from './TutorialPage';
import { ContainerUri, LeafUri } from '@ldo/solid';
import { useLdo } from '@ldo/solid-react';
const TutorialRoute = () => {
  const { tutUri } = useParams();
  const { getResource } = useLdo();

  const deleteTut = useCallback(
    async (tutUri: string) => {
      const tutContainer = getResource(tutUri);
      await tutContainer.delete();
    },
    [getResource]
  );

  if (tutUri) {
    // const decodedTutUri = decodeURIComponent(tutUri);
    return (
      <TutorialPage
        tutUri={tutUri as ContainerUri}
        deleteTut={() => deleteTut(tutUri)}
      />
    );
  } else {
    return null;
  }
};

export default TutorialRoute;
