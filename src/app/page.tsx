'use client'

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const cameras = [
    { id: 1, name: 'Front Door', image: '/images/camera1.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 2, name: 'Living Room', image: '/images/camera2.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 3, name: 'Kitchen', image: '/images/camera3.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 4, name: 'Backyard', image: '/images/camera4.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 5, name: 'Garage', image: '/images/camera5.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 6, name: 'Driveway', image: '/images/camera6.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 7, name: 'Hallway', image: '/images/camera7.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 8, name: 'Master Bedroom', image: '/images/camera8.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 9, name: 'Guest Room', image: '/images/camera9.jpg', cloudRecording: true, licensePlateDetection: true },
    { id: 10, name: 'Basement', image: '/images/camera10.jpg', cloudRecording: true, licensePlateDetection: true },
  ];

  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Camera Management</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cameras..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <Image
                  src={camera.image}
                  alt={`Feed from ${camera.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">{camera.name}</h2>
                  <div className="flex space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}