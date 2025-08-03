import React, { useState, useEffect } from 'react';

const BinarySearch = () => {
  const [array, setArray] = useState([1,3,5,7,9,11,13,15]);
  const [target, setTarget] = useState(11);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(7);
  const [mid, setMid] = useState(3);
  const [found, setFound] = useState(null);
  const [history, setHistory] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [error, setError] = useState('');
  const [activeExplanation, setActiveExplanation] = useState('Welcome to Binary Search! Start by simulating the algorithm.');

  const maxSteps = 10;
  const explanations = [
    'Binary search requires a sorted array to work correctly.',
    `Set initial pointers: low=${low}, high=${high}`,
    `Calculate mid = Math.floor((${low} + ${high}) / 2) = ${Math.floor((low + high)/2)}`,
    `Comparing target ${target} with element at mid (${array[mid]})...`,
    'Target is greater than mid element, so we narrow to right half',
    'Target is less than mid element, so we narrow to left half',
    'Target found! Algorithm completes successfully.',
    'Target not in array. Low pointer passed high pointer.'
  ];

  const validateInput = () => {
    if (array.length === 0) {
      setError('Array cannot be empty');
      return false;
    }
    if (isNaN(target)) {
      setError('Target must be a number');
      return false;
    }
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i-1]) {
        setError('Array must be sorted in ascending order');
        return false;
      }
    }
    return true;
  };

  const startSearch = () => {
    if (!validateInput()) return;
  
    setError('');
    const steps = [];
    let l = 0;
    let h = array.length - 1;
    let m = Math.floor((l + h) / 2);
    let explanationIndex = 0;
    let foundIndex = null;
  
    steps.push({
      low: l,
      high: h,
      mid: m,
      action: 'initial',
      explanation: explanations[explanationIndex++],
      found: false
    });
  
    while (l <= h) {
      m = Math.floor((l + h) / 2);
      setMid(m);
      setLow(l);
      setHigh(h);
  
      if (array[m] === parseInt(target)) {
        steps.push({
          low: l,
          high: h,
          mid: m,
          action: 'found',
          explanation: explanations[4 + (array[m] > target ? 1 : 0)],
          found: true
        });
        foundIndex = m;
        setActiveExplanation('Element found!');
        break;
      } else if (array[m] < parseInt(target)) {
        steps.push({
          low: l,
          high: h,
          mid: m,
          action: 'right',
          explanation: explanations[3],
          found: false
        });
        l = m + 1;
      } else {
        steps.push({
          low: l,
          high: h,
          mid: m,
          action: 'left',
          explanation: explanations[3],
          found: false
        });
        h = m - 1;
      }
    }
    
    if (foundIndex === null) {
      steps.push({
        low: l,
        high: h,
        mid: -1,
        action: 'not-found',
        explanation: explanations[5],
        found: false
      });
      setActiveExplanation('Element not found in array.');
    }
  
    setHistory(steps);
    setStepIndex(0);
    setFound(foundIndex);
  };

  const nextStep = () => {
    if (stepIndex < history.length - 1) {
      setStepIndex(stepIndex + 1);
      const step = history[stepIndex + 1];
      setLow(step.low);
      setHigh(step.high);
      setMid(step.mid);
      setFound(step.found);
    } else {
      setPlaying(false);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      const step = history[stepIndex - 1];
      setLow(step.low);
      setHigh(step.high);
      setMid(step.mid);
      setFound(step.found);
    }
  };

  const reset = () => {
    setLow(0);
    setHigh(array.length - 1);
    setMid(Math.floor(array.length / 2));
    setStepIndex(0);
    setHistory([]);
    setPlaying(false);
    setFound(null);
    setActiveExplanation(explanations[0]);
  };

  useEffect(() => {
    if (history.length > 0) {
      setActiveExplanation(history[stepIndex].explanation);
    }
  }, [stepIndex]);

  useEffect(() => {
    let interval;
    if (playing && stepIndex < history.length - 1) {
      interval = setInterval(() => {
        nextStep();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [playing, speed, stepIndex, history]);

  useEffect(() => {
    reset();
  }, [array]);

  const handleArrayChange = (e) => {
    try {
      const arr = e.target.value.split(',').map(v => parseInt(v.trim()));
      setArray(arr);
      reset();
      setError('');
    } catch (err) {
      setError('Invalid array format. Use comma-separated numbers.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-indigo-600 mb-2">Binary Search Algorithm</h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Efficiently find elements in sorted arrays using the divide-and-conquer approach. Binary search operates in O(log n) time complexity.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Explanation Section */}
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 shadow-sm min-h-[200px]">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">Algorithm Explanation</h3>
            <p className="text-gray-700 mb-4 font-medium transition-all duration-500 opacity-100">
              {activeExplanation}
            </p>
            
            <div className="bg-gray-800 text-gray-100 p-3 rounded text-sm font-mono transition-all opacity-90">
              <div className="mb-1">{stepIndex >= 1 && `low = ${low}`}</div>
              <div className="mb-1">{stepIndex >= 1 && `high = ${high}`}</div>
              <div className="mb-1">{stepIndex >= 2 && `mid = (${low} + ${high}) // 2 = ${mid}`}</div>
              <div className="text-green-400">
                {stepIndex >= 3 && array[mid] === parseInt(target) && `array[${mid}] == ${target}`}
                {stepIndex >= 3 && array[mid] < parseInt(target) && `array[${mid}] < ${target}`}
                {stepIndex >= 3 && array[mid] > parseInt(target) && `array[${mid}] > ${target}`}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Array (sorted)</label>
                <input
                  type="text"
                  value={array.join(', ')}
                  onChange={handleArrayChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-label="Enter sorted array (comma separated)"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Target Value</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-label="Target value to search"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={startSearch}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Run binary search"
              >
                Start Search
              </button>
              <button
                onClick={prevStep}
                disabled={stepIndex === 0 || history.length === 0}
                className={`px-4 py-2 rounded transition focus:outline-none focus:ring-2 ${stepIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                aria-label="Previous step"
              >
                ← Back
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                disabled={history.length === 0 || stepIndex === history.length - 1}
                className={`px-4 py-2 rounded transition focus:outline-none focus:ring-2 ${history.length === 0 || stepIndex === history.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
                aria-label={playing ? "Pause animation" : "Play animation"}
              >
                {playing ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={nextStep}
                disabled={history.length === 0 || stepIndex === history.length - 1}
                className={`px-4 py-2 rounded transition focus:outline-none focus:ring-2 ${history.length === 0 || stepIndex === history.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                aria-label="Next step"
              >
                Next →
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Reset visualization"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <h3 className="font-bold text-orange-700 mb-2">Tips & Best Practices</h3>
            <ul className="text-orange-600 text-sm list-disc list-inside space-y-1">
              <li>Always ensure arrays are sorted before applying binary search</li>
              <li>Ensure your array has no duplicate values when implementing search</li>
              <li>Use the formula mid = low + Math.floor((high - low)/2) to prevent integer overflow on large arrays</li>
            </ul>
          </div>
        </div>

        {/* Visualization Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Visualization</h3>
          <div className="flex justify-center">
            <div className="rounded overflow-hidden border border-gray-300">
              {array.map((value, index) => {
                let bgColor = 'bg-white';
                if ((index >= low && index <= high) ) {
                  bgColor = 'bg-blue-100';
                } 
                if (index === low || index === high) {
                  bgColor = 'bg-blue-300';
                }
                if (index === mid) {
                  bgColor = 'bg-yellow-300';
                }
                if (found === index) {
                  bgColor = 'bg-green-300';
                }

                return (
                  <div 
                    key={index} 
                    className={`w-16 h-16 inline-flex flex-col items-center justify-center border-r border-gray-300 font-medium transition-all duration-300 ${bgColor}`}
                    style={{ transitionDelay: index * 50 + 'ms' }}
                  >
                    <div className="text-lg font-bold">{value}</div>
                    <div className="text-xs text-gray-500 mt-1">index {index}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="py-4 px-6 bg-indigo-800 text-white rounded-lg text-center">
              <div className="flex items-center justify-around mb-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-300 mr-1"></div>
                  <span>Low/High Pointers</span>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-4 h-4 bg-yellow-300 mr-1"></div>
                  <span>Mid Pointer</span>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-4 h-4 bg-green-300 mr-1"></div>
                  <span>Found Element</span>
                </div>
              </div>
              <div className="h-10 flex items-center">
                <div className="bg-white h-px flex-grow"></div>
                <div className="px-3">Current Search Space</div>
                <div className="bg-white h-px flex-grow"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Algorithm Status</h3>
            <div className="bg-gray-800 p-4 rounded text-white font-mono text-sm">
              <div>Current step: {history.length > 0 ? stepIndex + 1 : 0}/{history.length}</div>
              <div className="mt-2">
                {found !== null ? (
                  <span className="text-green-400">✓ Found at position {found}</span>
                ) : (
                  history.length > 0 && stepIndex === history.length - 1 ? (
                    <span className="text-red-400">✗ Target not found</span>
                  ) : (
                    <span className="text-yellow-400">↻ Searching...</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3">How Binary Search Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-gray-50 p-4 rounded">
            <span className="text-indigo-600 font-bold">Step 1</span>
            <p className="mt-2">Start with the entire sorted array and set pointers (low, high)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="text-indigo-600 font-bold">Step 2</span>
            <p className="mt-2">Calculate mid point and check if it's the target element</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="text-indigo-600 font-bold">Step 3</span>
            <p className="mt-2">If target is smaller, search left; if larger, search right</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearch;