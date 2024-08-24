'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

function getRandomImage() {
  return `/images/camera${Math.floor(Math.random() * 10) + 1}.jpg`;
}

function createCameras(count: number, prefix: string) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${prefix} Camera ${i + 1}`,
    image: getRandomImage(),
    cloudRecording: Math.random() > 0.2,
    licensePlateDetection: Math.random() > 0.5
  }));
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const locations = [
    { id: 1, name: 'Home', cameras: createCameras(20, 'Home') },
    { id: 2, name: 'Office', cameras: createCameras(20, 'Office') },
    { id: 3, name: 'Warehouse', cameras: createCameras(20, 'Warehouse') },
    { id: 4, name: 'Retail Store', cameras: createCameras(20, 'Store') },
  ];

  const filteredLocations = locations.map(location => ({
    ...location,
    cameras: location.cameras.filter(camera =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(location => location.cameras.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Mobile Menu */}
      {isMobile && (
        <div className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Camera Management</h1>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {menuOpen && (
            <nav className="mt-4">
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Manage Cameras</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Billing & Invoices</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Share</a>
            </nav>
          )}
        </div>
      )}

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="bg-white w-64 min-h-screen shadow-lg fixed left-0 top-0 z-30">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>
          <nav className="mt-8">
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Cameras</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Billing & Invoices</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Share</a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-8 ${!isMobile ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {!isMobile && <h1 className="text-4xl font-bold mb-8 text-gray-900">Camera Management</h1>}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search cameras..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredLocations.map(location => (
            <div key={location.id} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{location.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {location.cameras.map((camera) => (
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
                        <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
                        <div className="flex space-x-2">
                          {camera.cloudRecording && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          )}
                          {camera.licensePlateDetection && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}