const fs = require('fs');
const { Parser, Store } = require('n3');
const path = require('path');

let PREFIXES; // a global variable

const extractShapeName = (shapeUri) => {
  const name = shapeUri.substring(shapeUri.lastIndexOf('/') + 1);
  return `ex:${name.replace("Shape", "")}`; // Assuming your shape URIs end with 'Shape' you want to remove
};

const shexCardinality = (minCount, maxCount) => {
  console.log(`Translating cardinality: minCount = ${minCount}, maxCount = ${maxCount}`);
  if (minCount === 0 && maxCount === undefined) return '*';
  if (minCount === 1 && (maxCount === undefined || maxCount > 1)) return '+';
  if (minCount === 0 && maxCount === 1) return '?';
  return '';
};

const shexDataType = (datatype, nodeKind) => {
  console.log(`Translating datatype: datatype = ${datatype}, nodeKind = ${nodeKind}`);
  if (datatype) {
    return datatype.replace('http://www.w3.org/2001/XMLSchema#', 'xsd:');
  }
  if (nodeKind === 'http://www.w3.org/ns/shacl#IRI') {
    return 'IRI';
  }
  return '';
};

const isReferenceToOtherShape = (store, propertyShape) => {
  const classQuads = store.getQuads(propertyShape, 'http://www.w3.org/ns/shacl#class', null);
  return classQuads.length > 0; // If there's a sh:class, it references another shape
};

const translatePropertyShape = (store, shape) => {
  const props = store.getQuads(shape, 'http://www.w3.org/ns/shacl#property', null);
  console.log(`Found ${props.length} properties for shape ${shape.value}`);
  let shexProperties = '';
  props.forEach(prop => {
    try {
      const path = uriToPrefixDummy(store.getObjects(prop.object, 'http://www.w3.org/ns/shacl#path', null)[0].value);
      const minCountQuad = store.getQuads(prop.object, 'http://www.w3.org/ns/shacl#minCount', null)[0];
      const maxCountQuad = store.getQuads(prop.object, 'http://www.w3.org/ns/shacl#maxCount', null)[0];
      const datatypeQuad = store.getQuads(prop.object, 'http://www.w3.org/ns/shacl#datatype', null)[0];
      const nodeKindQuad = store.getQuads(prop.object, 'http://www.w3.org/ns/shacl#nodeKind', null)[0];

      const minCount = minCountQuad ? parseInt(minCountQuad.object.value) : 0;
      const maxCount = maxCountQuad ? parseInt(maxCountQuad.object.value) : undefined;
      const cardinality = shexCardinality(minCount, maxCount);
    const propertyShape = prop.object;
 // Check if the property references another shape
    if (isReferenceToOtherShape(store, propertyShape)) {
      // For referenced shapes, format with @ and use cardinality
      const classQuad = store.getQuads(propertyShape, 'http://www.w3.org/ns/shacl#class', null)[0];
      const referencedShape = classQuad.object.value;
      const prefixedPath = uriToPrefixDummy(path); // Ensure uriToPrefixDummy function is already defined and used here
      const prefixedShape = uriToPrefixDummy(referencedShape);

      shexProperties += `  ${prefixedPath} @${prefixedShape}${cardinality};\n`;
    } else {
      // Handle non-referencing properties as before
      const dataTypeQuad = store.getQuads(propertyShape, 'http://www.w3.org/ns/shacl#datatype', null)[0];
      const nodeKindQuad = store.getQuads(propertyShape, 'http://www.w3.org/ns/shacl#nodeKind', null)[0];
      const dataType = dataTypeQuad ? dataTypeQuad.object.value : '';
      const nodeKind = nodeKindQuad ? nodeKindQuad.object.value : '';

      const type = shexDataType(dataType, nodeKind); // Assume shexDataType handles datatype and nodeKind conversion
      const prefixedPath = uriToPrefixDummy(path);

      shexProperties += `  ${prefixedPath} ${type}${cardinality};\n`;
    }    } catch (error) {
      console.error('Error translating property shape:', error);
    }
  });
  return shexProperties;
};


const parsePrefixes = (parser,turtleContent) => {
  let prefixes = {}; // Object to store prefix-URI mappings
  parser.parse(turtleContent, (error, quad, prefixMap) => {
    if (prefixMap) {
      prefixes = prefixMap; // Capture the prefixes
    }
    if (quad) {
      // Process each quad as before
    }
    if (error) {
      console.error('Parsing error:', error);
    }
  });
  return prefixes
}


const uriToPrefixDummy = (uri) => {
  return uri.replace('http://example.org/', 'ex:');
};

const uriToPrefix = (uri, prefixes=PREFIXES) => {
  // Not working
  console.log("PREFIXES", PREFIXES)
  for (const [prefix, namespace] of Object.entries(prefixes)) {
    if (uri.startsWith(namespace)) {
      return uri.replace(namespace, prefix + ':');
    }
  }
  return uri; // Return the original URI if no matching prefix is found
};
const translateShaclToShEx = (inputFilePath, outputFilePath) => {
  try {
    const turtleContent = fs.readFileSync(inputFilePath, 'utf-8');
    console.log('Turtle content:', turtleContent);
    console.log('SHACL content loaded.');
    const parser = new Parser();
    const store = new Store(parser.parse(turtleContent));
    console.log('SHACL content parsed into RDF quads.');
		const prefixes = parsePrefixes(parser, turtleContent);
		PREFIXES = prefixes;
    let shexSchema = "PREFIX ex: <http://example.org/>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\n";

    const shapes = store.getSubjects(null, 'http://www.w3.org/ns/shacl#NodeShape', null);
    // const allSubjects = store.getSubjects(null, null, null);
    // console.log(`All subjects found: ${allSubjects.map(subject => subject.value)}`);

    console.log(`Found ${shapes.length} shapes.`);

    shapes.forEach(shape => {
      try {
        // const shapeId = shape.value.split('#')[1];
        const shapeId = uriToPrefix(extractShapeName(shape.value));
        console.log(`Translating shape: ${shapeId}`);
        const properties = translatePropertyShape(store, shape);
        shexSchema += `${shapeId} {\n${properties}}\n\n`;
      } catch (error) {
        console.error('Error processing shape:', error);
      }
    });

    fs.writeFileSync(outputFilePath, shexSchema);
    console.log(`Translation completed: ${outputFilePath}`);
  } catch (error) {
    console.error('Error during translation:', error);
  }
};

// Adjust these file paths as necessary for your environment
const inputPath = path.join(__dirname, '../src/.shapes/tutorial.ttl');
const outputPath = path.join(__dirname, '../src/.shapes/tutorial.shex');

try {
  console.log('Starting SHACL to ShEx translation...');
  translateShaclToShEx(inputPath, outputPath);
} catch (mainError) {
  console.error('Main execution error:', mainError.message);
}

