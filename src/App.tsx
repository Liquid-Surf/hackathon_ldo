import { BrowserSolidLdoProvider } from '@ldo/solid-react';
import Routing from './components/Routing';

import './App.css';

function App() {
  return (
    <>
      <div className="App">
        <BrowserSolidLdoProvider>
          <Routing />
        </BrowserSolidLdoProvider>
      </div>
    </>
  );
}

export default App;
