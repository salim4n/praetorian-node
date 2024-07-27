"use client"

import { useState } from 'react'

export default function Discover() {
  const [devices, setDevices] = useState([])
  const [error, setError] = useState<string | null>(null)

  const discoverDevices = async () => {
    try {
      const response = await fetch('/api/rtsp', { method: 'GET' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDevices(data)
    } catch (error:any) {
      setError(error.message)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discover WiFi Cameras</h1>
      <p className="mb-4">
        To discover WiFi cameras, please click the button below. Make sure you are connected to the same network as the cameras.
      </p>
      <button onClick={discoverDevices} className="bg-blue-500 text-white px-4 py-2 rounded">
        Discover Cameras
      </button>
      <div className="mt-4">
        {error && <p className="text-red-500">{error}</p>}
        {devices.length > 0 ? (
          <ul>
            {devices.map((device, index) => (
              <li key={index} className="border p-2 mb-2">
                <pre>{JSON.stringify(device, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p>No devices found.</p>
        )}
      </div>
    </div>
  )
}
