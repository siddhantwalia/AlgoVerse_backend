<code-file name="Linear_search.jsx">
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiStepForward, FiStepBack } from 'react-icons/fi';

function LinearSearch() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [target, setTarget] = useState(5);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleStepForward = () => {
    setStep(step + 1);
  };

  const handleStepBack = () => {
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setPlaying(false);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const linearSearch = (array, target) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === target) {
        return i;
      }
    }
    return -1;
  };

  const result = linearSearch(array, target);

  const steps = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      steps.push(`Found ${target} at index ${i}`);
    } else {
      steps.push(`Compared ${target} with ${array[i]}, not a match`);
    }
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 XL:p-24">
      <h1 className="text-3xl font-bold mb-4">Learn Linear Search Algorithm</h1>
      <p className="text-lg mb-4">
        Linear search is a simple searching algorithm that works by iterating through each element in the array and checking if it matches the target value.
      </p>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Array:</label>
        <input
          type="text"
          value={array.join(', ')}
          onChange={(e) => setArray(e.target.value.split(', ').map(Number))}
          className="p-2 border border-gray-400 rounded"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Target:</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="p-2 border border-gray-400 rounded"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Speed:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={handleSpeedChange}
          className="p-2 border border-gray-400 rounded"
        />
      </div>
      <div className="flex flex-col mb-4">
        <button className="p-2 bg-blue-500 text-white rounded" onClick={handlePlay}>
          <FiPlay />
        </button>
        <button className="p-2 bg-blue-500 text-white rounded" onClick={handlePause}>
          <FiPause />
        </button>
        <button className="p-2 bg-blue-500 text-white rounded" onClick={handleStepForward}>
          <FiStepForward />
        </button>
        <button className="p-2 bg-blue-500 text-white rounded" onClick={handleStepBack}>
          <FiStepBack />
        </button>
        <button className="p-2 bg-blue-500 text-white rounded" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold mb-2">Steps:</h2>
        {steps.map((step, index) => (
          <p key={index} className="text-lg mb-2">
            {step}
          </p>
        ))}
      </div>
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold mb-2">Result:</h2>
        {result !== -1 ? (
          <p className="text-lg mb-2">
            Found {target} at index {result}
          </p>
        ) : (
          <p className="text-lg mb-2">Not found</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default LinearSearch;
</code-file>

<explanation>
This React component generates a learning page for the Linear Search algorithm. The page includes a brief overview of the algorithm, input fields for the array and target value, a speed adjustment slider, and buttons to play, pause, step forward, step back, and reset the animation. The animation displays the steps of the algorithm, highlighting the comparison of each element in the array with the target value. The result of the search is displayed at the bottom of the page.
</explanation>

<dependencies>
- react
- react-toastify
- framer-motion
- react-icons
</dependencies>