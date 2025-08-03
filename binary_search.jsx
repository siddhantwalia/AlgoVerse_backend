import React, { useState, useEffect, useRef } from 'react';

const BinarySearch = () => {
  const [data, setData] = useState({ array: [], target: '' });
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [showingMoreInfo, setShowingMoreInfo] = useState(false);
  const [errors, setErrors] = useState('');
  const [pseudocode, setPseudocode] = useState([
    { text: "low = 0, high = n-1", active: false },
    { text: "while low <= high:", active: false },
    { text: "  mid = Math.floor((low + high) / 2)", active: false },
    { text: "  if arr[mid] == target: return mid", active: false },
    { text: "  else if arr[mid] < target: low = mid + 1", active: false },
    { text: "  else: high = mid - 1", active: false },
    { text: "return -1  # Not found", active: false }
  ]);
  const speechSynthRef = useRef(null);
  
  useEffect(() => {
    window.speechSynthesis?.getVoices().length ? setVoices(window.speechSynthesis.getVoices()) : 
      window.speechSynthesis?.addEventListener('voiceschanged', () => 
        setVoices(window.speechSynthesis.getVoices())
      );
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      handleStepChange(currentStep + 1);
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(v => v.name === selectedVoice) || voices[0];
    window.speechSynthesis.speak(utterance);
    speechSynthRef.current = utterance;
  };

  const validateInput = (array, target) => {
    setErrors('');
    if (!array.length) return "Array cannot be empty";
    if (isNaN(target)) return "Target must be a number";
    const arrNums = array.split(',').map(Number);
    if (arrNums.some(isNaN)) return "Array must contain numbers only";
    if (!arrNums.every((val, i, arr) => i === 0 || val >= arr[i - 1]))
      return "Array must be sorted in ascending order";
    return '';
  };

  const buildSteps = (arr, target) => {
    const stepArray = [];
    let low = 0, high = arr.length - 1;
    stepArray.push({
      arr: [...arr],
      low,
      high,
      mid: null,
      explanation: 'Starting search: low at start, high at end',
      pseudoline: 0
    });
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      stepArray.push({
        arr: [...arr],
        low,
        high,
        mid,
        explanation: `Calculating midpoint: mid = (${low} + ${high}) / 2 = ${mid}`,
        pseudoline: 2
      });
      
      if (arr[mid] === target) {
        stepArray.push({
          arr: [...arr],
          low,
          high,
          mid,
          explanation: `Found target at position ${mid}!`,
          pseudoline: 3
        });
        return stepArray;
      } else if (arr[mid] < target) {
        stepArray.push({
          arr: [...arr],
          low,
          high,
          mid,
          explanation: `${arr[mid]} < ${target} - searching upper half`,
          pseudoline: 4
        });
        low = mid + 1;
      } else {
        stepArray.push({
          arr: [...arr],
          low,
          high,
          mid,
          explanation: `${arr[mid]} > ${target} - searching lower half`,
          pseudoline: 5
        });
        high = mid - 1;
      }
    }
    
    stepArray.push({
      arr: [...arr],
      low,
      high,
      mid: null,
      explanation: "Target not found",
      pseudoline: 6
    });
    return stepArray;
  };

  const handleSubmit = () => {
    const errMsg = validateInput(data.array, data.target);
    if (errMsg) {
      setErrors(errMsg);
      return;
    }
    
    const arr = data.array.split(',').map(Number);
    const searchSteps = buildSteps(arr, Number(data.target));
    setSteps(searchSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleStepChange = (step) => {
    if (step < 0 || step >= steps.length) return;
    setCurrentStep(step);
    setPseudocode(pc => 
      pc.map((line, i) => ({ ...line, active: i === steps[step].pseudoline }))
    );
    speakText(steps[step].explanation);
  };

  const togglePlayPause = () => {
    if (isPlaying) speakText("Animation paused");
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(0);
    setErrors('');
    setPseudocode(pc => pc.map(line => ({ ...line, active: false })));
    if (voiceEnabled) {
      speakText("Animation reset. Enter new values to restart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="animate-fadeIn mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-2">
          Binary Search Algorithm
        </h1>
        <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
          Efficient algorithm to find an item in a sorted array by repeatedly dividing the search interval.
          Time Complexity: <span className="font-mono font-semibold">O(log n)</span>
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="array" className="block font-medium mb-1">
                  Sorted Array (comma separated)
                </label>
                <input
                  id="array"
                  type="text"
                  value={data.array}
                  onChange={e => setData({...data, array: e.target.value})}
                  placeholder="e.g., 2,5,8,12,16,23,38"
                  className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Enter sorted numbers separated by commas"
                />
              </div>
              
              <div>
                <label htmlFor="target" className="block font-medium mb-1">
                  Target Value
                </label>
                <input
                  id="target"
                  type="number"
                  value={data.target}
                  onChange={e => setData({...data, target: e.target.value})}
                  className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Enter target number"
                />
              </div>
              
              {errors && (
                <div className="text-red-500 font-medium p-2 bg-red-50 rounded mt-2 animate-pulse">
                  Error: {errors}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex-1"
                  aria-label="Start binary search visualization"
                >
                  Start Search
                </button>
                <button
                  onClick={() => setShowingMoreInfo(!showingMoreInfo)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-300"
                  aria-label={`${showingMoreInfo ? 'Hide' : 'Show'} algorithm information`}
                >
                  {showingMoreInfo ? 'Less Info' : 'More Info'}
                </button>
              </div>
            </div>
          </div>
          
          <div className={`bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-100 duration-500 transition-all ease-in-out ${showingMoreInfo ? 'opacity-100' : 'opacity-90'}`}>
            <h2 className="font-bold text-xl text-blue-800 mb-2">Algorithm Insights</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">1</span>
                <span><b>Divide & Conquer:</b> Halves search space each iteration</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">2</span>
                <span><b>Prerequisite:</b> Input array <span className="font-mono">must be sorted</span></span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">3</span>
                <span><b>Key Steps:</b> Calculate midpoint; compare; adjust search boundaries</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">Real World Uses</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Searching in databases and file systems</li>
                <li>Debugging - "divide and conquer" troubleshooting</li>
                <li>Resource lookups in computer networks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 animate-fadeInUp">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray（800">Pseudocode</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPseudocode(pc => 
                pc.map(line => ({ ...line, active: false }))
              )}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
              aria-label="Hide pseudocode highlights"
            >
              Clear Marks
            </button>
          </div>
        </div>
        
        <pre className="bg-gray-800 text-green-300 p-4 rounded-lg overflow-x-auto">
          {pseudocode.map((line, i) => (
            <div
              key={i}
              className={`p-1 transition-colors duration-300 ${line.active ? 'bg-yellow-700 text-yellow-100' : ''}`}
            >
              {line.text}
            </div>
          ))}
        </pre>
      </div>
      
      {steps.length > 0 && (
        <div className="animate-slideFade bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Visualization</h2>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-full ${currentStep === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  aria-label="Go to previous step"
                >
                  &larr;
                </button>
                <button
                  onClick={togglePlayPause}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
                  aria-label={`${isPlaying ? 'Pause' : 'Play'} animation`}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  disabled={currentStep >= steps.length - 1}
                  className={`p-2 rounded-full ${currentStep >= steps.length - 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  aria-label="Go to next step"
                >
                  &rarr;
                </button>
              </div>
              
              <input
                type="range"
                min="500"
                max="2500"
                step="100"
                value={2500 - speed}
                onChange={(e) => setSpeed(2500 - parseInt(e.target.value))}
                className="w-28 accent-blue-500"
                aria-label="Adjust animation speed"
              />
              <span className="text-gray-700">Speed</span>
              
              <div className="flex items-center gap-2">
                {voices.length > 0 && window.speechSynthesis ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="text-sm border rounded px-2 py-1 text-gray-700"
                      aria-label="Select voice for narration"
                    >
                      {voices.map((voice, i) => (
                        <option key={i} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`px-3 py-1 rounded-full font-medium ${voiceEnabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                      aria-label={`Turn voice ${voiceEnabled ? 'off' : 'on'}`}
                    >
                      {voiceEnabled ? '🔊 Voice On' : '🔈 Voice Off'}
                    </button>
                  </div>
                ) : (
                  <div className="text-yellow-600 text-sm px-2 py-1 bg-yellow-50 rounded border border-yellow-200">
                    Voice narration unavailable in this browser
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6 bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex justify-center gap-1 mb-4">
              {steps[currentStep]?.arr.map((num, idx) => (
                <div
                  key={idx}
                  className={`border-2 w-14 h-14 flex items-center justify-center rounded relative transition-all duration-300
                    ${
                      idx === steps[currentStep].mid
                        ? 'bg-yellow-500 border-yellow-700 text-white scale-110 font-bold'
                        : idx >= (steps[currentStep].low || -1) && 
                          idx <= (steps[currentStep].high === undefined ? -1 : steps[currentStep].high)
                          ? 'bg-blue-500 border-blue-700 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                >
                  {num}
                  {idx === steps[currentStep]?.low && (
                    <div className="absolute -bottom-6 text-xs text-blue-600 font-bold">low</div>
                  )}
                  {idx === steps[currentStep]?.high && (
                    <div className="absolute -bottom-6 text-xs text-red-600 font-bold">high</div>
                  )}
                  {idx === steps[currentStep]?.mid && (
                    <div className="absolute -top-6 text-xs text-yellow-600 font-bold">mid</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="min-h-[40px] flex items-center justify-center mb-4">
            <p className="text-center bg-blue-100 text-blue-800 p-3 rounded-lg border border-blue-200 animate-pulseTransition duration-500">
              {steps[currentStep]?.explanation}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
              aria-label="Reset visualization"
            >
              Reset Visualization
            </button>
          </div>
        </div>
      )}
      
      <footer className="text-center text-gray-600 pb-8 pt-4 animate-fadeIn">
        <h2 className="font-bold text-lg text-gray-700 mb-2">Key Considerations</h2>
        <ul className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          <li className="bg-white border p-3 rounded-lg shadow-sm flex-1 min-w-[250px]">
            <h3 className="font-bold mb-1 text-red-600">Pitfalls</h3>
            <p>
              Forgetting to sort input data first will produce incorrect results
            </p>
          </li>
          <li className="bg-white border p-3 rounded-lg shadow-sm flex-1 min-w-[250px]">
            <h3 className="font-bold mb-1 text-green-600">Optimizations</h3>
            <p>
              Minimal memory footprint - only tracks 3 pointers during execution
            </p>
          </li>
          <li className="bg-white border p-3 rounded-lg shadow-sm flex-1 min-w-[250px]">
            <h3 className="font-bold mb-1 text-purple-600">Application Tips</h3>
            <p>
              Always prefer over linear search for large sorted datasets
            </p>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default BinarySearch;