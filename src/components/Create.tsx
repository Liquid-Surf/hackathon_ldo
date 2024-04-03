import { FunctionComponent, useCallback, useState } from 'react';
import { Container, LeafUri } from '@ldo/solid';
import { useLdo, useSolidAuth } from '@ldo/solid-react';
import { parseRdf } from '@ldo/ldo';

import tutorialShacl from '../.shapes/tutorial.json';
import { literal, quad, namedNode } from '@rdfjs/data-model';
import { Quad, Dataset } from '@rdfjs/types';

import { v4 } from 'uuid';

import ShaclForm from './ShaclForm';

export const Create: FunctionComponent<{ mainContainer: Container }> = ({
  mainContainer,
}) => {
  const { session } = useSolidAuth();
  const { dataset } = useLdo();
  const [images, setImages] = useState<Array<[File, string]>>([]);

  const createResourceContainer = async (
    parentContainer: Container,
    containerName?: string
  ) => {
    if (!containerName) containerName = `${v4()}/`;
    if (containerName.slice(-1) !== '/') containerName += '/';

    const tutContainerResult =
      await parentContainer.createChildAndOverwrite(containerName);
    if (tutContainerResult.isError) {
      alert(tutContainerResult.message);
      return;
    }
    return tutContainerResult.resource as Container;
  };

  const rawTurtleToLdoDataset = async (
    rawTurtle: string,
    targetResourceUrl: string
  ): Promise<Dataset<Quad, Quad> | undefined> => {
    try {
      const rawTurtleDataset = await parseRdf(rawTurtle, {
        baseIRI: targetResourceUrl,
      });
      const resourceGraph = namedNode(targetResourceUrl + 'index.ttl');
      const formDataset = rawTurtleDataset.map((q) => {
        if (
          q.predicate.value &&
          q.predicate.value === 'http://example.org/image'
        ) {
          // We're trying to clean up the file path by replacing the fake path prefix
          // added by web browsers when selecting a file, with the actual resource URI.
          const imgUri = literal(
            q.object.value.replace(
              'C:\\fakepath\\',
              `${targetResourceUrl}images/`
            )
          );

          return quad(q.subject, q.predicate, imgUri, resourceGraph);
        }

        return quad(q.subject, q.predicate, q.object, resourceGraph);
      });

      return formDataset;
    } catch (e) {
      console.log('Error parsing from RDF', e);
      return;
    }
  };

  const addFormResultToLoggedUserPod = useCallback(
    async (rawTurtle: string) => {
      const tutorialMainContainerResource =
        await createResourceContainer(mainContainer);
      if (tutorialMainContainerResource === undefined) return;

      const formDataset = await rawTurtleToLdoDataset(
        rawTurtle,
        tutorialMainContainerResource.uri
      );
      if (!formDataset) return;

      const transaction = dataset.startTransaction();
      transaction.addAll(formDataset);
      const result = await transaction.commitToPod();
      if (result.isError) console.log('Error:', result.message);

      // upload images

      const imageContainer = await createResourceContainer(
        tutorialMainContainerResource,
        'images/'
      );
      images.map(async ([file, destinationFolder], index) => {
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
        }
      });
      // Set Wac rules
      const resource = dataset.getResource(tutorialMainContainerResource.uri);
      const wacRes = await resource.setWac({
        public: {
          read: true,
          write: false,
          append: false,
          control: false,
        },
        authenticated: {
          // This is too permissive
          // but only way I have found to both create
          // and delete resource, didn't work otherwise
          read: true,
          write: true,
          append: true,
          control: true,
        },
        agent: {
          webId: {
            read: true,
            write: true,
            append: true,
            control: true,
          },
        },
      });
    },
    [images, createResourceContainer, dataset, rawTurtleToLdoDataset, mainContainer]
  );

  const getImageFile = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      destinationFolder: string = ''
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setImages((prevImages) => [...prevImages, [file, destinationFolder]]);
      } else {
        console.log(
          'No file nor image to be uploaded in the following event:',
          e
        );
      }
    },
    []
  );
  return (
    <>
      <h1> Create a new Tutorial </h1>
      {session.isLoggedIn ? (
        <ShaclForm
          id="createTutorial"
          dataSubmitButton="Create Tutorial"
          shape={tutorialShacl.shape}
          callbackRdfFormResult={addFormResultToLoggedUserPod}
          getFile={getImageFile}
        />
      ) : (
        <p> Log in to create a tutorial </p>
      )}
    </>
  );
};
