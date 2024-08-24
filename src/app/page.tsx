'use client'

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const cameras = [
    { id: 1, name: 'Front Door', image: '/images/camera1.jpg' },
    { id: 2, name: 'Living Room', image: '/images/camera2.jpg' },
    { id: 3, name: 'Kitchen', image: '/images/camera3.jpg' },
    { id: 4, name: 'Backyard', image: '/images/camera4.jpg' },
    { id: 5, name: 'Garage', image: '/images/camera5.jpg' },
    { id: 6, name: 'Driveway', image: '/images/camera6.jpg' },
    { id: 7, name: 'Hallway', image: '/images/camera7.jpg' },
    { id: 8, name: 'Master Bedroom', image: '/images/camera8.jpg' },
    { id: 9, name: 'Guest Room', image: '/images/camera9.jpg' },
    { id: 10, name: 'Basement', image: '/images/camera10.jpg' },
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
                <h2 className="text-lg font-semibold text-gray-900">{camera.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}