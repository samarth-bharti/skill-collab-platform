// src/api/mockData.js

export const mockUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'A', role: 'Designer' },
  { id: 2, name: 'Bob Williams', avatar: 'B', role: 'Frontend' },
  { id: 3, name: 'Charlie Smith', avatar: 'C', role: 'Backend' },
  { id: 4, name: 'Dana Lee', avatar: 'D', role: 'DevOps' },
];

export const mockMessages = {
  1: [
    { id: 1, sender: 1, text: 'Hey, are we shipping today?' },
    { id: 2, sender: 2, text: 'Almost — final QA is in progress.' },
  ],
  2: [
    { id: 1, sender: 2, text: 'When is the next deploy?' },
    { id: 2, sender: 1, text: 'Later today, after tests pass.' },
  ],
  3: [],
  4: [
    { id: 1, sender: 4, text: 'Docs updated for the new API.' },
    { id: 2, sender: 1, text: 'Nice — thanks!' },
  ]
};

export const mockNotifications = [
  { id: 1, type: 'comment', text: 'Alice commented on "Web3 Social Platform".', time: '5m ago' },
  { id: 2, type: 'like', text: 'Bob liked your post about smart contracts.', time: '1h ago' },
  { id: 3, type: 'invite', text: 'New invite for "DeFi Analytics Dashboard".', time: '3h ago' },
];

export const mockProjects = [
  {
    id: 1,
    name: 'Decentralized Identity System',
    description: 'Create a self-sovereign identity solution using blockchain.',
    tags: ['Blockchain', 'Identity', 'Solidity'],
    members: [1, 2],
    status: 'Ongoing',
  },
  {
    id: 2,
    name: 'NFT Marketplace for Artists',
    description: 'A platform for digital artists to mint and sell NFTs.',
    tags: ['NFT', 'React', 'Web3'],
    members: [2, 3, 4],
    status: 'Planned',
  },
  {
    id: 3,
    name: 'AI-Powered Smart Contract Auditor',
    description: 'Detect vulnerabilities in smart contracts using ML.',
    tags: ['AI', 'Security', 'Ethereum'],
    members: [1, 3],
    status: 'Ongoing',
  },
];

export const mockTasks = [
  { id: 1, text: 'Design the new landing page.', completed: false, user: 1, projectId: 1, project: 'Decentralized Identity System' },
  { id: 2, text: 'Develop the authentication flow.', completed: true, user: 2, projectId: 2, project: 'NFT Marketplace for Artists' },
  { id: 3, text: 'Set up database on Appwrite.', completed: true, user: 3, projectId: 3, project: 'AI-Powered Smart Contract Auditor' },
  { id: 4, text: 'Fix routing bug on dashboard.', completed: false, user: 1, projectId: 1, project: 'Decentralized Identity System' },
];

// --- ADD THIS NEW SECTION ---
export const mockTimeline = [
  { id: 1, time: '08:00', user: 'Alice', action: 'created', target: 'Project: Decentralized Identity System' },
  { id: 2, time: '10:00', user: 'Bob', action: 'commented on', target: 'PR #112' },
  { id: 3, time: '14:00', user: 'Charlie', action: 'updated', target: 'Profile UI' },
  { id: 4, time: '16:00', user: 'Dana', action: 'deployed', target: 'Staging' },
];