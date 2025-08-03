import React, { useState, useEffect } from 'react';

function LinearSearch() {
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState(false);
  const [speech, setSpeech] = useState(new SpeechSynthesisUtterance());
  const [supported, setSupported] = useState('speechSynthesis' in window);

  const handleStart = () => {
    setStep(0);
    const arr = array.split(',').map(Number);
    const targetNum = parseInt(target);
    linearSearch(arr, targetNum);
  };

  const linearSearch = (arr, target) => {
    for (let i = 0; i < arr.length; i++) {
      setStep(i);
      if (arr[i] === target) {
        alert(`Target found at index ${i}`);
        return;
      }
    }
    alert('Target not found');
  };

  const handleVoice = () => {
    setVoice(!voice);
  };

  const handleStep = (direction) => {
    if (direction === 'next') {
      setStep(step + 1);
    } else {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (supported && voice) {
      speech.text = `Step ${step}: Checking if array[${step}] is equal to ${target}`;
      window.speechSynthesis.speak(speech);
    }
  }, [step, voice, supported]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Linear Search Algorithm</h1>
      <p className="text-lg mb-8">Learn how linear search works with this interactive tutorial.</p>
      <input
        type="text"
        className="px-4 py-2 border border-gray-400 rounded"
        placeholder="Enter array (comma separated)"
        value={array}
        onChange={(e) => setArray(e.target.value)}
        aria-label="Array input"
      />
      <input
        type="number"
        className="px-4 py-2 border border-gray-400 rounded mt-4"
        placeholder="Enter target"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        aria-label="Target input"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleStart}
        aria-label="Start simulation"
      >
        Start
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
        onClick={handleVoice}
        aria-label="Toggle voice"
      >
        {voice ? 'Voice Off' : 'Voice On'}
      </button>
      {supported ? (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
            onClick={() => handleStep('prev')}
            aria-label="Previous step"
          >
            Prev
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
            onClick={() => handleStep('next')}
            aria-label="Next step"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="text-yellow-600">Voice narration unavailable in this browser.</div>
      )}
      <div className="mt-8">
        {step >= 0 && (
          <p className="text-lg">
            Step {step}: Checking if array[{step}] is equal to {target}
          </p>
        )}
      </div>
    </div>
  );
}

export default LinearSearch;