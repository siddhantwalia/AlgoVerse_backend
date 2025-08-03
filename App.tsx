<code-file name="App.tsx">
```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

interface LinearSearchProps {
  array: number[];
  target: number;
}

const LinearSearch: React.FC<LinearSearchProps> = ({ array, target }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [found, setFound] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const linearSearch = async () => {
    for (let i = 0; i < array.length; i++) {
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      if (array[i] === target) {
        setFound(true);
        setCurrentIndex(i);
        break;
      }
      setCurrentIndex(i);
    }
  };

  const handleReset = () => {
    setFound(false);
    setCurrentIndex(0);
  };

  return (
    <div className="linear-search">
      <h2>Linear Search</h2>
      <p>
        Linear search is a simple searching algorithm that works by iterating through each element in the array until it finds a match.
      </p>
      <div className="array-container">
        {array.map((item, index) => (
          <motion.div
            key={index}
            className={`array-item ${currentIndex === index ? 'active' : ''} ${found && index === currentIndex ? 'found' : ''}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
      <div className="controls">
        <button onClick={linearSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
        <input
          type="number"
          value={animationSpeed}
          onChange={e => setAnimationSpeed(Number(e.target.value))}
          placeholder="Animation Speed (ms)"
        />
      </div>
      {found && <p>Target {target} found at index {currentIndex}!</p>}
    </div>
  );
};

const App: React.FC = () => {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [target, setTarget] = useState(5);

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = e.target.value.split(',').map(Number);
    setArray(newArray);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTarget = Number(e.target.value);
    setTarget(newTarget);
  };

  return (
    <div className="app">
      <ToastContainer />
      <h1>Learn Linear Search Algorithm</h1>
      <p>
        Linear search is a simple searching algorithm that works by iterating through each element in the array until it finds a match.
      </p>
      <div className="input-container">
        <input
          type="text"
          value={array.join(',')}
          onChange={handleArrayChange}
          placeholder="Array (comma-separated)"
        />
        <input
          type="number"
          value={target}
          onChange={handleTargetChange}
          placeholder="Target"
        />
      </div>
      <LinearSearch array={array} target={target} />
    </div>
  );
};

export default App;
```
</code-file>

<explanation>
This code generates a React application that teaches the linear search algorithm. The application includes an input form for the array and target, a 'Search' button that triggers the animation, and a 'Reset' button to restart the animation. The animation highlights the current index and found element in the array. The application also includes a toast notification system to display errors or success messages.
</explanation>

<dependencies>
* `framer-motion` for animations
* `react-toastify` for toast notifications
* `tailwindcss` for styling
</dependencies>

To run this code, create a new React project using `create-react-app` and replace the `App.tsx` file with the above code. Install the required dependencies using `npm install framer-motion react-toastify tailwindcss`. Start the application using `npm start`.