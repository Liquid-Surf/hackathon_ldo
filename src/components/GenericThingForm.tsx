import React, { useRef, useEffect, ReactNode } from 'react';

import { ImageUploadPlugin } from '../shacl-form/dist/plugins/image-upload';
import '../shacl-form/dist/form-material.js';
import { useNavigate } from 'react-router-dom';

interface ShaclFormElement extends HTMLElement {
  serialize: (format?: string) => string;
  registerPlugin: any;
}

interface IGenericThingForm {
  id: string;
  shape: string;
  dataSubmitButton: string;
  callbackRdfFormResult: (rdfFormResult: string) => void;
  getFile: (
    event: React.ChangeEvent<HTMLInputElement>,
    destinationFolder?: string
  ) => void;
}

const ShaclForm = ({
  id,
  shape,
  dataSubmitButton,
  callbackRdfFormResult,
  getFile,
}: IGenericThingForm) => {
  const navigate = useNavigate();
  const formRef = useRef<ShaclFormElement | null>(null);
  const form = React.createElement('shacl-form', {
    'data-shapes': shape,
    id: id,
    ref: formRef,
    'data-submit-button': dataSubmitButton,
    'data-value-subject': 'index.ttl',
    className: 'genric-thing-form',
  });

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    // if (event.detail?.valid )
    const triples = formRef.current?.serialize();
    if (triples) {
      try {
        await callbackRdfFormResult(triples);
        navigate(`/myprojects`);
      } catch (e) {
        console.log('Error handling form result', e);
      }
    }
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmitAndPreventDefault = (event: Event) => {
      event.preventDefault();
      handleSubmit(event as Event);
    };

    form.addEventListener('submit', handleSubmitAndPreventDefault);
    return () => {
      if (form) {
        form.removeEventListener('submit', handleSubmitAndPreventDefault);
      }
    };
  }, [handleSubmit]);

  useEffect(() => {
    // const form = document.querySelector('shacl-form') as ShaclFormElement
    const form = formRef.current;
    if (form) {
      form.registerPlugin(
        new ImageUploadPlugin({ datatype: 'http://example.com/image' }, getFile)
      );
    }
  }, [getFile]);

  return <>{form}</>;
};

export default ShaclForm;
