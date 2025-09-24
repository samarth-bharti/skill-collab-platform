import React, { useState, useMemo } from 'react';
import { mockProjects } from '../../api/mockData';
import ProjectCard from '../../components/dashboard/ProjectCard';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="p-8">
      {/* Page heading */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-250 dark:text-gray-100">
        Discover Projects
      </h1>

      {/* Search box */}
      <div className="mb-8 max-w-md">
        <input
          type="text"
          aria-label="Search projects"
          placeholder="Search by name or tags..."
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="transition-shadow rounded-lg shadow hover:shadow-lg"
            >
              <ProjectCard project={project} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No projects found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
