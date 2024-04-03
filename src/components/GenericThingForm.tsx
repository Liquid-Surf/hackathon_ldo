import React, { FunctionComponent, useCallback, useRef, useEffect, ReactNode, FormEvent, createElement } from 'react';
import { createThing, createSolidDataset, getSolidDataset, saveSolidDatasetAt, setThing } from '@inrupt/solid-client';
import { TutorialShapeType } from "../.ldo/tutorial.shapeTypes"
import { Container, Leaf, LeafUri } from "@ldo/solid";
// import { FixedListPlugin } from "./shacl-form/plugins/fixed-list"
// import { LeafletPlugin } from "./shacl-form/plugins/leaflet"
import { ImageUploadPlugin } from "../shacl-form/dist/plugins/image-upload"
import "../shacl-form/dist/form-material.js"
import { Navigate, useNavigate } from 'react-router-dom';



interface IGenericThingForm {
    id: string,
    shape: string,
    dataSubmitButton: string,
    callbackRdfFormResult: (rdfFormResult: string) => void,
    getFile: (event: any, destinationFolder?: string) => void,
};

type FormWrapperProps = {
  children: ReactNode;
  onSubmit: (event: Event) => void;
};

const FormWrapper: React.FC<FormWrapperProps> = ({ children, onSubmit }) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      onSubmit(event as Event);
    };

    form.addEventListener('submit', handleSubmit);
    return () => {
      if(form) {
        form.removeEventListener('submit', handleSubmit);
      }
    };
  }, [onSubmit]);

  return <div ref={formRef}>{children}</div>;
};


interface ShaclFormElement extends HTMLElement {
  serialize: (format?:string) => string; // Adjust the return type according to what serialize() actually returns
}


const GenericThingForm = ({id, shape, dataSubmitButton, callbackRdfFormResult, getFile}: IGenericThingForm) => {

  const navigate = useNavigate();
  const formRef = useRef<ShaclFormElement | null>(null);
  const shapeExampleUrl = "https://ulb-darmstadt.github.io/shacl-form/complex-example.ttl";
  let form = React.createElement("shacl-form", {
    		"data-shapes": shape,
        // "data-shapes": shapeExample,
        // "data-shapes-url": shapeExampleUrl ,
        "id": id,
        "ref": formRef,
        "data-submit-button": dataSubmitButton,
        "data-value-subject":  "index.ttl",
        "className": "genric-thing-form"
    });

	// const uploadImageIntro = (event: any) => getFile(event, 'intro/')
	// const uploadImageStep  = (event: any) => getFile(event, 'step/')
	useEffect(()=>{
  	const form = document.querySelector('shacl-form') as any
  	const logEvent = (event:any) => console.log("WORKING", event)
  	if (form) {
       form.registerPlugin(new ImageUploadPlugin({ datatype: 'http://example.com/image' }, getFile))
       // form.registerPlugin(new ImageUploadPlugin({ datatype: 'http://example.com/image/step' }, uploadImageStep))
       // form.registerPlugin(new LeafletPlugin({ datatype: 'http://a.a/foobar' }))
  	}

	}, []);

    const handleSubmit = async (event: any) => {
      event.preventDefault();
       // if (event.detail?.valid ) 
      const triples = formRef.current?.serialize() 
      if (triples){
        await callbackRdfFormResult(triples);
      navigate(`/myprojects`)
      }
    }


    return <FormWrapper onSubmit={handleSubmit}>{form}</FormWrapper>;
};

export default GenericThingForm;
