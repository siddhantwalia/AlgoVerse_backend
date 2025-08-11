import React, { useState, useEffect, useRef } from 'react'

export default function LinearSearch() {
  const [arrayInput, setArrayInput] = useState('1, 3, 5, 7, 9')
  const [targetInput, setTargetInput] = useState('5')
  const [array, setArray] = useState([])
  const [target, setTarget] = useState(null)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setVoiceSupported(false)
    }
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) return prev + 1
          clearInterval(intervalRef.current)
          return prev
        })
      }, speed)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, steps])

  useEffect(() => {
    if (!voiceEnabled || !voiceSupported) return
    const utter = new SpeechSynthesisUtterance(steps[currentStep]?.desc || '')
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }, [currentStep, steps, voiceEnabled, voiceSupported])

  const parseInputs = () => {
    const arr = arrayInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => Number(s))
    if (arr.some(isNaN)) {
      alert('Invalid array: ensure all items are numbers')
      return false
    }
    const tgt = Number(targetInput)
    if (isNaN(tgt)) {
      alert('Target must be a number')
      return false
    }
    setArray(arr)
    setTarget(tgt)
    const generated = []
    let found = false
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === tgt) {
        generated.push({ idx: i, desc: `Checking index ${i} (value ${arr[i]}). Target found!` })
        found = true
        break
      } else {
        generated.push({ idx: i, desc: `Checking index ${i} (value ${arr[i]}) – not a match` })
      }
    }
    if (!found) {
      generated.push({ idx: -1, desc: `Target ${tgt} not found in the array.` })
    }
    setSteps(generated)
    setCurrentStep(0)
    setPlaying(false)
    return true
  }

  const handleStart = () => {
    if (parseInputs()) {
      setPlaying(true)
    }
  }

  const handlePlayPause = () => {
    setPlaying(p => !p)
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1)
  }

  const stepBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1)
  }

  const handleReset = () => {
    setPlaying(false)
    setCurrentStep(0)
    window.speechSynthesis.cancel()
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 opacity-0 animate-fade-in">Learn Linear Search Algorithm</h1>
      <p className="mb-4 opacity-0 animate-fade-in-delay-200">
        Linear Search scans each element of an array sequentially to find a target value.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block font-medium mb-1">Array (comma separated)</label>
          <input
            type="text"
            value={arrayInput}
            onChange={e => setArrayInput(e.target.value)}
            className="w-full p-2 border rounded"
            aria-label="Array input"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Target value</label>
          <input
            type="text"
            value={targetInput}
              onChange={e => setTargetInput(e.target.value)}
              className="w-full p-2 border rounded"
              aria-label="Target input"
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={handleStart} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Start
          </button>
          <button onClick={handlePlayPause} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={stepBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Step Back
          </button>
          <button onClick={stepForward} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Step Forward
          </button>
          <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Reset
          </button>
          <label className="flex items-center gap-2 ml-auto">
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-32"
              aria-label="Speed control"
            />
            <span className="text-sm">{speed} ms</span>
          </label>
          <button
            onClick={() => setVoiceEnabled(v => !v)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>
        {voiceSupported ? null : (
          <div className="text-yellow-600 mb-2">
            Voice narration unavailable in this browser.
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-6">
          {array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center border rounded transition-all duration-500 ${
                idx === steps[currentStep]?.idx
                  ? 'bg-yellow-300'
                  : 'bg-gray-100'
              } ${
                idx === steps[currentStep]?.idx && playing
                  ? 'scale-110'
                  : ''
              }`}
            >
              {val}
            </div>
          ))}
        </div>
        <div className="border p-4 rounded bg-gray-50">
          <p className="font-medium mb-2">Explanation</p>
          {steps[currentStep] && (
            <p className="animate-fade-in">{steps[currentStep].desc}</p>
          )}
        </div>
        <div className="mt-8 text-sm text-gray-600">
          <p className="mb-2">Tips:</p>
          <ul className="list-disc list-inside">
            <li>Linear search works on unsorted arrays.</li>
            <li>Best case O(1) if first element matches.</li>
            <li>Worst case O(n) when element is absent.</li>
          </ul>
          <p className="mt-4">Further reading: algorithm basics, time complexity analysis.</p>
        </div>
      </div>
  )
}