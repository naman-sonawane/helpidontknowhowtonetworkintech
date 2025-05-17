import { useState } from 'react'

interface CounterProps {
  initialCount?: number
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount)

  return (
    <div className="p-4 bg-gray-100 rounded-lg sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-4 sm:text-3xl md:text-4xl">Counter</h2>
      <div className="text-4xl font-bold mb-4 sm:text-5xl md:text-6xl">{count}</div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
        >
          -
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto"
        >
          +
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8 sm:text-4xl md:text-5xl">TypeScript React App</h1>
      <div className="max-w-2xl mx-auto">
        <Counter />
      </div>
    </main>
  )
}

export default App
