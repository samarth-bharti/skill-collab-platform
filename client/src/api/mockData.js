// src/api/mockData.js

export const mockUsers = [
  { id: 1, name: 'Satoshi Nakamoto', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 2, name: 'Vitalik Buterin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: 3, name: 'Charles Hoskinson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 4, name: 'Gavin Wood', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

export const mockMessages = {
  1: [
    { sender: 'me', text: 'Are you really the founder of Bitcoin?' },
    { sender: 1, text: 'The world may never know.' },
    { sender: 'me', text: 'Fair enough.' },
  ],
  2: [
    { sender: 'me', text: 'Hey, when is the next Ethereum update?' },
    { sender: 2, text: 'Soon. We are working hard on the scalability trilemma.' },
  ],
  3: [],
  4: [
    { sender: 4, text: 'Polkadot is the future of interoperability.' },
    { sender: 'me', text: 'Interesting! Tell me more.' },
  ]
};

export const mockNotifications = [
    { id: 1, type: 'comment', text: 'Alice Johnson commented on your project "Web3 Social Platform".', time: '5m ago' },
    { id: 2, type: 'like', text: 'Bob Williams liked your post about smart contracts.', time: '1h ago' },
    { id: 3, type: 'invite', text: 'You have a new collaboration invite for "DeFi Analytics Dashboard".', time: '3h ago' },
];

export const mockProjects = [
    { id: 1, title: 'Decentralized Identity System', description: 'A project to create a self-sovereign identity solution using blockchain.', tags: ['Blockchain', 'Identity', 'Solidity'] },
    { id: 2, title: 'NFT Marketplace for Artists', description: 'A platform for digital artists to mint and sell their work as NFTs.', tags: ['NFT', 'React', 'Web3'] },
    { id: 3, title: 'AI-Powered Smart Contract Auditor', description: 'Using machine learning to detect vulnerabilities in smart contracts.', tags: ['AI', 'Security', 'Ethereum'] },
];

export const mockTasks = [
    { id: 1, text: 'Design the new landing page.', completed: false },
    { id: 2, text: 'Develop the user authentication flow.', completed: true },
    { id: 3, text: 'Set up the project database on Appwrite.', completed: true },
    { id: 4, text: 'Fix the routing bug on the dashboard.', completed: false },
];

// --- ADD THIS NEW SECTION ---
export const mockTimeline = [
    { time: '08:00', title: 'Morning Stand-up', description: 'Team sync for the DeFi project.' },
    { time: '10:00', title: 'Code Review', description: 'Review pull request #112 for the NFT marketplace.' },
    { time: '14:00', title: 'Design Meeting', description: 'Finalize the UI for the profile page.' },
    { time: '16:00', title: 'Push to Staging', description: 'Deploy the latest authentication updates.' },
];