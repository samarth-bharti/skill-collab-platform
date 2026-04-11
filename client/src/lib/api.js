const STORAGE_KEYS = {
  users: "skill-collab.users",
  currentUser: "skill-collab.currentUser",
  messages: "skill-collab.messages",
  settings: "skill-collab.settings",
  resetEmail: "skill-collab.resetEmail",
  projects: "skill-collab.projects",
  friendRequests: "skill-collab.friendRequests",
  notifications: "skill-collab.notifications",
  projectRequests: "skill-collab.projectRequests",
};

const browserStorage = typeof window !== "undefined" ? window.localStorage : null;

const clone = (value) => JSON.parse(JSON.stringify(value));
const nowIso = () => new Date().toISOString();

const readJson = (key, fallback) => {
  if (!browserStorage) return fallback;
  const raw = browserStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!browserStorage) return;
  browserStorage.setItem(key, JSON.stringify(value));
};

const emitDataUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("skill-collab:data-updated"));
  }
};

const buildId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const sanitizeUser = (user) => {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  return {
    ...safeUser,
    name: safeUser.name || safeUser.fullName || "",
    fullName: safeUser.fullName || safeUser.name || "",
    topSkills: safeUser.topSkills || [],
  };
};

const createSeedUsers = () => [
  {
    $id: "user-alex",
    id: "user-alex",
    userId: "user-alex",
    name: "Alex Mercer",
    fullName: "Alex Mercer",
    email: "alex@skillcollab.dev",
    password: "password123",
    role: "Frontend Engineer",
    location: "Pune, India",
    college: "PCCOE",
    headline: "Ships polished product UI and collaborates like a founder.",
    status: "online",
    topSkills: ["React", "Tailwind", "Product Thinking"],
    interests: ["Hackathons", "Startup Ideas", "Open Source"],
    skillsVerified: 12,
    endorsements: 28,
    githubScore: 94,
    profilePicture: "",
    bio: "Builds student products with strong UX, clean component systems, and crisp execution.",
    availability: "Available for 2 active projects",
    createdAt: "2026-03-01T09:00:00.000Z",
    $createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    $id: "user-maya",
    id: "user-maya",
    userId: "user-maya",
    name: "Maya Chen",
    fullName: "Maya Chen",
    email: "maya@skillcollab.dev",
    password: "password123",
    role: "Product Designer",
    location: "Bengaluru, India",
    college: "RVCE",
    headline: "Turns vague ideas into shippable product flows and systems.",
    status: "focus",
    topSkills: ["Figma", "Research", "Design Systems"],
    interests: ["Case Studies", "UX Writing", "Social Products"],
    skillsVerified: 10,
    endorsements: 23,
    githubScore: 72,
    profilePicture: "",
    bio: "Loves structured collaboration, thoughtful product decisions, and clear workflows.",
    availability: "Open to product design collabs",
    createdAt: "2026-03-02T10:00:00.000Z",
    $createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    $id: "user-omar",
    id: "user-omar",
    userId: "user-omar",
    name: "Omar Khan",
    fullName: "Omar Khan",
    email: "omar@skillcollab.dev",
    password: "password123",
    role: "Backend Architect",
    location: "Hyderabad, India",
    college: "IIIT Hyderabad",
    headline: "Designs APIs and systems that scale from prototype to production.",
    status: "online",
    topSkills: ["Spring Boot", "System Design", "PostgreSQL"],
    interests: ["Backend", "Infra", "SaaS"],
    skillsVerified: 15,
    endorsements: 33,
    githubScore: 97,
    profilePicture: "",
    bio: "Enjoys translating messy product needs into reliable technical systems.",
    availability: "Looking for strong frontend partners",
    createdAt: "2026-03-03T11:00:00.000Z",
    $createdAt: "2026-03-03T11:00:00.000Z",
  },
  {
    $id: "user-rina",
    id: "user-rina",
    userId: "user-rina",
    name: "Rina Patel",
    fullName: "Rina Patel",
    email: "rina@skillcollab.dev",
    password: "password123",
    role: "Growth & Community",
    location: "Ahmedabad, India",
    college: "Nirma University",
    headline: "Builds traction loops around student and creator communities.",
    status: "away",
    topSkills: ["Community", "Content", "Growth"],
    interests: ["Student Communities", "Creator Economy", "Launches"],
    skillsVerified: 8,
    endorsements: 16,
    githubScore: 48,
    profilePicture: "",
    bio: "Helps products find their people through content systems and community programs.",
    availability: "Available for launch support",
    createdAt: "2026-03-04T12:00:00.000Z",
    $createdAt: "2026-03-04T12:00:00.000Z",
  },
  {
    $id: "user-sana",
    id: "user-sana",
    userId: "user-sana",
    name: "Sana Iqbal",
    fullName: "Sana Iqbal",
    email: "sana@skillcollab.dev",
    password: "password123",
    role: "ML Engineer",
    location: "Delhi, India",
    college: "DTU",
    headline: "Builds practical AI features for student-facing apps.",
    status: "online",
    topSkills: ["Python", "ML", "Prompt Design"],
    interests: ["AI Apps", "Recommendation Systems", "Hackathons"],
    skillsVerified: 11,
    endorsements: 20,
    githubScore: 89,
    profilePicture: "",
    bio: "Interested in real AI product features that improve collaboration and onboarding.",
    availability: "Available for AI-focused builds",
    createdAt: "2026-03-05T13:00:00.000Z",
    $createdAt: "2026-03-05T13:00:00.000Z",
  },
  {
    $id: "user-neel",
    id: "user-neel",
    userId: "user-neel",
    name: "Neel Desai",
    fullName: "Neel Desai",
    email: "neel@skillcollab.dev",
    password: "password123",
    role: "Mobile Developer",
    location: "Mumbai, India",
    college: "VJTI",
    headline: "Builds fast mobile experiences and prototypes quickly.",
    status: "offline",
    topSkills: ["React Native", "Firebase", "UX"],
    interests: ["Mobile Apps", "Social Products", "Side Projects"],
    skillsVerified: 9,
    endorsements: 14,
    githubScore: 76,
    profilePicture: "",
    bio: "Pairs well with product and backend teams to ship end-to-end student apps.",
    availability: "Open for weekend builds",
    createdAt: "2026-03-06T14:00:00.000Z",
    $createdAt: "2026-03-06T14:00:00.000Z",
  },
];

const createDefaultSettings = (user) => ({
  profile: {
    personalInfo: {
      firstName: (user?.fullName || user?.name || "").split(" ")[0] || "",
      lastName: (user?.fullName || user?.name || "").split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      availability: user?.availability || "",
    },
  },
  collaboration: {
    openToConnections: true,
    showAvailability: true,
    allowProjectInvites: true,
  },
  privacy: {
    account: {
      profileVisibility: "community",
      showEmail: false,
      loginAlerts: true,
      twoFactorEnabled: false,
    },
  },
  notifications: {
    push: {
      enabled: true,
      messages: true,
      projectUpdates: true,
      friendRequests: true,
    },
    email: {
      enabled: false,
      weeklyDigest: true,
    },
  },
  integrations: {
    connected: [
      { service: "GitHub", connected: true, username: "student-builder" },
      { service: "LinkedIn", connected: false, username: "" },
      { service: "Portfolio", connected: false, username: "" },
    ],
  },
  appearance: {
    theme: "dark",
    accentColor: "green",
    compactMode: false,
    animations: true,
  },
});

const createSeedFriendRequests = () => [
  {
    id: "req-1",
    senderId: "user-maya",
    receiverId: "user-alex",
    status: "accepted",
    createdAt: "2026-03-10T10:00:00.000Z",
    respondedAt: "2026-03-10T12:00:00.000Z",
  },
  {
    id: "req-2",
    senderId: "user-omar",
    receiverId: "user-alex",
    status: "accepted",
    createdAt: "2026-03-09T10:00:00.000Z",
    respondedAt: "2026-03-09T12:00:00.000Z",
  },
  {
    id: "req-3",
    senderId: "user-sana",
    receiverId: "user-alex",
    status: "pending",
    createdAt: "2026-04-07T12:00:00.000Z",
  },
  {
    id: "req-4",
    senderId: "user-alex",
    receiverId: "user-rina",
    status: "pending",
    createdAt: "2026-04-08T08:00:00.000Z",
  },
];

const createSeedMessages = () => [
  {
    $id: "message-1",
    id: "message-1",
    senderId: "user-maya",
    receiverId: "user-alex",
    conversationId: "user-alex_user-maya",
    content: "I turned the onboarding rough notes into a cleaner flow. Want the draft?",
    isRead: true,
    createdAt: "2026-04-08T09:15:00.000Z",
    $createdAt: "2026-04-08T09:15:00.000Z",
  },
  {
    $id: "message-2",
    id: "message-2",
    senderId: "user-alex",
    receiverId: "user-maya",
    conversationId: "user-alex_user-maya",
    content: "Yes please. Also add one version for students joining without prior teammates.",
    isRead: true,
    createdAt: "2026-04-08T09:22:00.000Z",
    $createdAt: "2026-04-08T09:22:00.000Z",
  },
  {
    $id: "message-3",
    id: "message-3",
    senderId: "user-omar",
    receiverId: "user-alex",
    conversationId: "user-alex_user-omar",
    content: "Spring Boot API contract is ready when you want to wire the frontend.",
    isRead: false,
    createdAt: "2026-04-10T15:30:00.000Z",
    $createdAt: "2026-04-10T15:30:00.000Z",
  },
];

const createSeedProjects = () => [
  {
    id: "project-skillsync",
    $id: "project-skillsync",
    name: "SkillSync Platform",
    tagline: "A collaboration network where students connect and ship together.",
    description: "Build the frontend-first experience for student networking, real project collaboration, chat, and progress tracking.",
    category: "Web Platform",
    status: "In Progress",
    visibility: "Public",
    ownerId: "user-alex",
    memberIds: ["user-alex", "user-maya", "user-omar"],
    requiredSkills: ["React", "UI Design", "Spring Boot", "Product Strategy"],
    lookingFor: ["QA Engineer", "Community Lead"],
    dueDate: "2026-05-18",
    budget: 0,
    repoUrl: "https://github.com/example/skill-sync",
    progress: 67,
    milestones: [
      { id: "ms-1", title: "Design dashboard IA", done: true },
      { id: "ms-2", title: "Frontend MVP", done: true },
      { id: "ms-3", title: "Backend integration", done: false },
      { id: "ms-4", title: "Beta testing", done: false },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Ship dashboard home, discover, chat, and settings surfaces",
        completed: true,
        priority: "High",
        assigneeId: "user-alex",
        dueDate: "2026-04-05",
      },
      {
        id: "task-2",
        title: "Define Spring Boot API contracts for auth, projects, and chat",
        completed: false,
        priority: "High",
        assigneeId: "user-omar",
        dueDate: "2026-04-15",
      },
      {
        id: "task-3",
        title: "Finalize collaboration request and connection states",
        completed: true,
        priority: "Medium",
        assigneeId: "user-maya",
        dueDate: "2026-04-04",
      },
    ],
    updates: [
      {
        id: "upd-1",
        authorId: "user-maya",
        text: "Shared the dashboard wireframes for discover, chat, and projects.",
        createdAt: "2026-04-07T11:00:00.000Z",
      },
      {
        id: "upd-2",
        authorId: "user-alex",
        text: "Connected localStorage state so the frontend behaves like a real app before backend work starts.",
        createdAt: "2026-04-09T10:30:00.000Z",
      },
    ],
    discussions: [
      {
        id: "discussion-1",
        authorId: "user-alex",
        text: "We should keep the frontend contracts stable so Spring Boot integration is mostly wiring.",
        createdAt: "2026-04-10T09:20:00.000Z",
      },
      {
        id: "discussion-2",
        authorId: "user-omar",
        text: "Agreed. I will mirror the local model in DTOs and controllers next.",
        createdAt: "2026-04-10T09:25:00.000Z",
      },
    ],
  },
  {
    id: "project-peerpath",
    $id: "project-peerpath",
    name: "PeerPath Mentor Match",
    tagline: "Mentors, peer groups, and accountability in one student app.",
    description: "A platform that matches students with mentors, peer circles, and progress rituals.",
    category: "Community Product",
    status: "Planning",
    visibility: "Campus",
    ownerId: "user-rina",
    memberIds: ["user-rina", "user-sana"],
    requiredSkills: ["Growth", "ML", "UX Research"],
    lookingFor: ["Frontend Engineer", "Backend Engineer"],
    dueDate: "2026-06-02",
    budget: 0,
    repoUrl: "",
    progress: 28,
    milestones: [
      { id: "ms-5", title: "Research student pain points", done: true },
      { id: "ms-6", title: "Prototype mentor matching", done: false },
      { id: "ms-7", title: "Recruit pilot users", done: false },
    ],
    tasks: [
      {
        id: "task-4",
        title: "Collect 20 discovery interviews",
        completed: true,
        priority: "High",
        assigneeId: "user-rina",
        dueDate: "2026-04-02",
      },
      {
        id: "task-5",
        title: "Draft a mentor recommendation prototype",
        completed: false,
        priority: "Medium",
        assigneeId: "user-sana",
        dueDate: "2026-04-20",
      },
    ],
    updates: [
      {
        id: "upd-3",
        authorId: "user-rina",
        text: "Interview synthesis says accountability and warm introductions matter most.",
        createdAt: "2026-04-08T14:00:00.000Z",
      },
    ],
    discussions: [],
  },
  {
    id: "project-shipmate",
    $id: "project-shipmate",
    name: "ShipMate Mobile",
    tagline: "A mobile accountability app for project streaks.",
    description: "Students log project sessions, daily wins, and progress streaks with friends.",
    category: "Mobile App",
    status: "Open for Members",
    visibility: "Public",
    ownerId: "user-neel",
    memberIds: ["user-neel", "user-maya"],
    requiredSkills: ["React Native", "Motion Design", "Growth"],
    lookingFor: ["Backend Engineer", "Community Manager"],
    dueDate: "2026-05-30",
    budget: 0,
    repoUrl: "",
    progress: 42,
    milestones: [
      { id: "ms-8", title: "Navigation and onboarding", done: true },
      { id: "ms-9", title: "Session tracking", done: false },
      { id: "ms-10", title: "Referral loop", done: false },
    ],
    tasks: [
      {
        id: "task-6",
        title: "Define streak dashboard interactions",
        completed: false,
        priority: "Medium",
        assigneeId: "user-maya",
        dueDate: "2026-04-22",
      },
    ],
    updates: [
      {
        id: "upd-4",
        authorId: "user-neel",
        text: "Onboarding is in place and now the team is moving into streak logic and social loops.",
        createdAt: "2026-04-06T18:00:00.000Z",
      },
    ],
    discussions: [],
  },
];

const createSeedNotifications = () => ({
  "user-alex": [
    {
      id: "notif-1",
      userId: "user-alex",
      type: "request",
      title: "New connection request",
      text: "Sana wants to connect and collaborate on AI product ideas.",
      actionPath: "/dashboard/discover",
      unread: true,
      createdAt: "2026-04-07T12:05:00.000Z",
    },
    {
      id: "notif-2",
      userId: "user-alex",
      type: "project",
      title: "Project update",
      text: "Omar pushed the backend contract draft for SkillSync Platform.",
      actionPath: "/dashboard/projects/project-skillsync",
      unread: true,
      createdAt: "2026-04-10T15:35:00.000Z",
    },
  ],
  "user-maya": [
    {
      id: "notif-3",
      userId: "user-maya",
      type: "message",
      title: "New message",
      text: "Alex replied about the onboarding flow.",
      actionPath: "/dashboard/chat",
      unread: false,
      createdAt: "2026-04-08T09:30:00.000Z",
    },
  ],
});

const createSeedProjectRequests = () => [
  {
    id: "project-request-1",
    projectId: "project-shipmate",
    senderId: "user-alex",
    receiverId: "user-neel",
    type: "join_request",
    status: "pending",
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "project-request-2",
    projectId: "project-peerpath",
    senderId: "user-rina",
    receiverId: "user-omar",
    type: "invite",
    status: "pending",
    createdAt: "2026-04-10T14:00:00.000Z",
  },
];

const getUsers = () => readJson(STORAGE_KEYS.users, createSeedUsers());
const saveUsers = (users) => writeJson(STORAGE_KEYS.users, users);
const getMessages = () => readJson(STORAGE_KEYS.messages, createSeedMessages());
const saveMessages = (messages) => writeJson(STORAGE_KEYS.messages, messages);
const getProjectsStore = () => readJson(STORAGE_KEYS.projects, createSeedProjects());
const saveProjectsStore = (projects) => writeJson(STORAGE_KEYS.projects, projects);
const getRequestsStore = () => readJson(STORAGE_KEYS.friendRequests, createSeedFriendRequests());
const saveRequestsStore = (requests) => writeJson(STORAGE_KEYS.friendRequests, requests);
const getNotificationsStore = () => readJson(STORAGE_KEYS.notifications, createSeedNotifications());
const saveNotificationsStore = (notifications) => writeJson(STORAGE_KEYS.notifications, notifications);
const getProjectRequestsStore = () => readJson(STORAGE_KEYS.projectRequests, createSeedProjectRequests());
const saveProjectRequestsStore = (requests) => writeJson(STORAGE_KEYS.projectRequests, requests);
const getSettingsMap = () => readJson(STORAGE_KEYS.settings, {});
const saveSettingsMap = (settings) => writeJson(STORAGE_KEYS.settings, settings);

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const getProjectProgress = (project) => {
  const total = project.tasks?.length || 0;
  if (!total) {
    return project.progress || 0;
  }

  const completed = project.tasks.filter((task) => task.completed).length;
  return Math.round((completed / total) * 100);
};

const withUserMeta = (user) => ({
  ...sanitizeUser(user),
  initials: getInitials(user?.fullName || user?.name),
});

const getAcceptedConnectionIds = (userId) =>
  getRequestsStore()
    .filter(
      (request) =>
        request.status === "accepted" &&
        (request.senderId === userId || request.receiverId === userId)
    )
    .map((request) => (request.senderId === userId ? request.receiverId : request.senderId));

const getRequestBetweenUsers = (userId, targetUserId) =>
  getRequestsStore().find(
    (request) =>
      (request.senderId === userId && request.receiverId === targetUserId) ||
      (request.senderId === targetUserId && request.receiverId === userId)
  );

const getConnectionStatus = (userId, targetUserId) => {
  const request = getRequestBetweenUsers(userId, targetUserId);
  if (!request) return "none";
  if (request.status === "accepted") return "connected";
  if (request.status === "declined") return "declined";
  if (request.senderId === userId) return "outgoing";
  return "incoming";
};

const pushNotification = (userId, notification) => {
  const notifications = getNotificationsStore();
  const next = notifications[userId] || [];
  notifications[userId] = [
    {
      id: buildId("notif"),
      userId,
      unread: true,
      createdAt: nowIso(),
      ...notification,
    },
    ...next,
  ].slice(0, 25);
  saveNotificationsStore(notifications);
  emitDataUpdate();
};

const hydrateProject = (project) => {
  const usersById = Object.fromEntries(getUsers().map((user) => [user.$id, withUserMeta(user)]));
  const memberIds = project.memberIds || [];
  const members = memberIds.map((memberId) => usersById[memberId]).filter(Boolean);
  const tasks = (project.tasks || []).map((task) => ({
    ...task,
    assignee: usersById[task.assigneeId] || null,
  }));
  const updates = (project.updates || []).map((update) => ({
    ...update,
    author: usersById[update.authorId] || null,
  }));
  const discussions = (project.discussions || []).map((entry) => ({
    ...entry,
    author: usersById[entry.authorId] || null,
  }));

  return {
    ...project,
    members,
    tasks,
    updates,
    discussions,
    progress: getProjectProgress(project),
  };
};

const getProjectRequestBetweenUsers = (projectId, senderId, receiverId, type) =>
  getProjectRequestsStore().find(
    (request) =>
      request.projectId === projectId &&
      request.senderId === senderId &&
      request.receiverId === receiverId &&
      request.type === type &&
      request.status === "pending"
  );

const getProjectMembershipState = (project, userId) => {
  if (!project || !userId) return "none";
  if (project.ownerId === userId) return "owner";
  if ((project.memberIds || []).includes(userId)) return "member";

  const requests = getProjectRequestsStore().filter(
    (request) => request.projectId === project.id || request.projectId === project.$id
  );
  if (requests.some((request) => request.senderId === userId && request.type === "join_request" && request.status === "pending")) {
    return "requested";
  }
  if (requests.some((request) => request.receiverId === userId && request.type === "invite" && request.status === "pending")) {
    return "invited";
  }
  return "visitor";
};

const ensureSeedData = () => {
  if (!browserStorage) return;

  if (!browserStorage.getItem(STORAGE_KEYS.users)) {
    saveUsers(createSeedUsers());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.messages)) {
    saveMessages(createSeedMessages());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.projects)) {
    saveProjectsStore(createSeedProjects());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.friendRequests)) {
    saveRequestsStore(createSeedFriendRequests());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.notifications)) {
    saveNotificationsStore(createSeedNotifications());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.projectRequests)) {
    saveProjectRequestsStore(createSeedProjectRequests());
  }
  if (!browserStorage.getItem(STORAGE_KEYS.settings)) {
    const users = getUsers();
    saveSettingsMap(
      Object.fromEntries(users.map((user) => [user.$id, createDefaultSettings(user)]))
    );
  }
};

ensureSeedData();

export { STORAGE_KEYS, ensureSeedData, sanitizeUser, createDefaultSettings };

export const getUserProfile = async (userId) => {
  const user = getUsers().find((entry) => entry.$id === userId || entry.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return withUserMeta(user);
};

export const getAllUsers = async () => getUsers().map(withUserMeta);

export const createUserProfile = async (userId, profileData) => {
  const users = getUsers();
  const index = users.findIndex((entry) => entry.$id === userId || entry.id === userId);

  if (index === -1) {
    throw new Error("User not found.");
  }

  const current = users[index];
  const fullName = profileData.fullName || profileData.name || current.fullName || current.name;
  const nextUser = {
    ...current,
    name: fullName,
    fullName,
    role: profileData.role || current.role,
    bio: profileData.bio || current.bio,
    topSkills: profileData.skills || profileData.topSkills || current.topSkills || [],
    github: profileData.github || current.github || "",
    linkedin: profileData.linkedin || current.linkedin || "",
    twitter: profileData.twitter || current.twitter || "",
    location: profileData.location || current.location || "",
    availability: profileData.availability || current.availability || "",
    headline: profileData.headline || current.headline || "",
    email: profileData.email || current.email,
    profilePicture: profileData.profilePicture || current.profilePicture || "",
  };

  users[index] = nextUser;
  saveUsers(users);

  const currentUser = readJson(STORAGE_KEYS.currentUser, null);
  if (currentUser && currentUser.$id === nextUser.$id) {
    writeJson(STORAGE_KEYS.currentUser, sanitizeUser(nextUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("skill-collab:user-updated"));
    }
  }

  const settingsMap = getSettingsMap();
  settingsMap[nextUser.$id] = {
    ...(settingsMap[nextUser.$id] || createDefaultSettings(nextUser)),
    profile: {
      personalInfo: {
        firstName: fullName.split(" ")[0] || "",
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        email: nextUser.email,
        bio: nextUser.bio || "",
        location: nextUser.location || "",
        availability: nextUser.availability || "",
      },
    },
  };
  saveSettingsMap(settingsMap);
  emitDataUpdate();

  return withUserMeta(nextUser);
};

export const getConnections = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, user]));
  return getAcceptedConnectionIds(userId)
    .map((connectionId) => users[connectionId])
    .filter(Boolean)
    .map(withUserMeta);
};

export const getPendingRequests = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, user]));
  return getRequestsStore()
    .filter((request) => request.receiverId === userId && request.status === "pending")
    .map((request) => ({
      ...request,
      sender: withUserMeta(users[request.senderId]),
    }));
};

export const getSentRequests = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, user]));
  return getRequestsStore()
    .filter((request) => request.senderId === userId && request.status === "pending")
    .map((request) => ({
      ...request,
      receiver: withUserMeta(users[request.receiverId]),
    }));
};

export const sendFriendRequest = async (senderId, receiverId) => {
  if (senderId === receiverId) {
    throw new Error("You cannot send a request to yourself.");
  }

  const existing = getRequestBetweenUsers(senderId, receiverId);
  if (existing && existing.status !== "declined") {
    return clone(existing);
  }

  const requests = getRequestsStore();
  const request = {
    id: buildId("request"),
    senderId,
    receiverId,
    status: "pending",
    createdAt: nowIso(),
  };

  requests.unshift(request);
  saveRequestsStore(requests);
  emitDataUpdate();

  const sender = await getUserProfile(senderId);
  pushNotification(receiverId, {
    type: "request",
    title: "New connection request",
    text: `${sender.fullName} sent you a connection request.`,
    actionPath: "/dashboard/discover",
  });

  return clone(request);
};

export const acceptFriendRequest = async (requestId, userId) => {
  const requests = getRequestsStore();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index === -1) {
    throw new Error("Request not found.");
  }
  if (requests[index].receiverId !== userId) {
    throw new Error("You cannot accept this request.");
  }

  requests[index] = {
    ...requests[index],
    status: "accepted",
    respondedAt: nowIso(),
  };
  saveRequestsStore(requests);
  emitDataUpdate();

  const receiver = await getUserProfile(userId);
  pushNotification(requests[index].senderId, {
    type: "connection",
    title: "Connection accepted",
    text: `${receiver.fullName} accepted your connection request.`,
    actionPath: "/dashboard/chat",
  });

  return clone(requests[index]);
};

export const declineFriendRequest = async (requestId, userId) => {
  const requests = getRequestsStore();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index === -1) {
    throw new Error("Request not found.");
  }
  if (requests[index].receiverId !== userId) {
    throw new Error("You cannot decline this request.");
  }

  requests[index] = {
    ...requests[index],
    status: "declined",
    respondedAt: nowIso(),
  };
  saveRequestsStore(requests);
  emitDataUpdate();

  return clone(requests[index]);
};

export const getDiscoverProfiles = async (userId) => {
  return getUsers()
    .filter((user) => user.$id !== userId)
    .map((user) => ({
      ...withUserMeta(user),
      connectionStatus: getConnectionStatus(userId, user.$id),
    }));
};

export const getMessagesFeed = () => getMessages();

export const sendMessage = async (senderId, receiverId, content) => {
  const timestamp = nowIso();
  const conversationId = [senderId, receiverId].sort().join("_");
  const id = buildId("message");
  const message = {
    $id: id,
    id,
    senderId,
    receiverId,
    conversationId,
    content,
    isRead: false,
    createdAt: timestamp,
    $createdAt: timestamp,
  };

  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
  emitDataUpdate();

  const sender = await getUserProfile(senderId);
  pushNotification(receiverId, {
    type: "message",
    title: "New message",
    text: `${sender.fullName}: ${content.slice(0, 60)}`,
    actionPath: "/dashboard/chat",
  });

  return clone(message);
};

export const sendDirectMessage = async (senderId, receiverId, content) =>
  sendMessage(senderId, receiverId, content);

export const getConversation = async (userId1, userId2, limit = 50) =>
  getMessages()
    .filter((message) => message.conversationId === [userId1, userId2].sort().join("_"))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-limit)
    .map(clone);

export const getUserConversations = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, user]));
  const latestByConversation = new Map();

  getMessages()
    .filter((message) => message.senderId === userId || message.receiverId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((message) => {
      if (latestByConversation.has(message.conversationId)) return;
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      latestByConversation.set(message.conversationId, {
        ...message,
        otherUserId,
        otherUser: withUserMeta(users[otherUserId]),
      });
    });

  return Array.from(latestByConversation.values()).map(clone);
};

export const markMessageAsRead = async (messageId) => {
  const messages = getMessages();
  const index = messages.findIndex((message) => message.$id === messageId || message.id === messageId);
  if (index === -1) {
    throw new Error("Message not found.");
  }
  messages[index] = { ...messages[index], isRead: true };
  saveMessages(messages);
  emitDataUpdate();
  return clone(messages[index]);
};

export const getUnreadMessagesCount = async (userId) =>
  getMessages().filter((message) => message.receiverId === userId && !message.isRead).length;

export const searchUsers = async (query, limit = 12) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  return getUsers()
    .map(withUserMeta)
    .filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm) ||
        user.location.toLowerCase().includes(searchTerm) ||
        user.topSkills.some((skill) => skill.toLowerCase().includes(searchTerm))
    )
    .slice(0, limit)
    .map(clone);
};

export const getFeaturedUsers = async (limit = 8) =>
  getUsers()
    .map(withUserMeta)
    .sort((a, b) => b.skillsVerified - a.skillsVerified)
    .slice(0, limit)
    .map(clone);

export const getProjects = async () =>
  getProjectsStore()
    .map(hydrateProject)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map(clone);

export const getProjectById = async (projectId) => {
  const project = getProjectsStore().find((entry) => entry.$id === projectId || entry.id === projectId);
  return project ? clone(hydrateProject(project)) : null;
};

export const getProjectMembership = async (projectId, userId) => {
  const project = await getProjectById(projectId);
  return getProjectMembershipState(project, userId);
};

export const getIncomingProjectRequests = async (ownerId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, withUserMeta(user)]));
  const projects = Object.fromEntries(getProjectsStore().map((project) => [project.id, project]));
  return getProjectRequestsStore()
    .filter((request) => request.receiverId === ownerId && request.type === "join_request" && request.status === "pending")
    .map((request) => ({
      ...request,
      sender: users[request.senderId] || null,
      project: projects[request.projectId] ? hydrateProject(projects[request.projectId]) : null,
    }));
};

export const getProjectInvitesForUser = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, withUserMeta(user)]));
  const projects = Object.fromEntries(getProjectsStore().map((project) => [project.id, project]));
  return getProjectRequestsStore()
    .filter((request) => request.receiverId === userId && request.type === "invite" && request.status === "pending")
    .map((request) => ({
      ...request,
      sender: users[request.senderId] || null,
      project: projects[request.projectId] ? hydrateProject(projects[request.projectId]) : null,
    }));
};

export const requestToJoinProject = async (projectId, userId) => {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Project not found.");
  if (project.memberIds.includes(userId)) throw new Error("You are already a member.");

  const existing = getProjectRequestBetweenUsers(project.id, userId, project.ownerId, "join_request");
  if (existing) return clone(existing);

  const requests = getProjectRequestsStore();
  const request = {
    id: buildId("project-request"),
    projectId: project.id,
    senderId: userId,
    receiverId: project.ownerId,
    type: "join_request",
    status: "pending",
    createdAt: nowIso(),
  };
  requests.unshift(request);
  saveProjectRequestsStore(requests);
  emitDataUpdate();

  const sender = await getUserProfile(userId);
  pushNotification(project.ownerId, {
    type: "project-request",
    title: "New project join request",
    text: `${sender.fullName} wants to join ${project.name}.`,
    actionPath: `/dashboard/projects/${project.id}`,
  });

  return clone(request);
};

export const inviteUserToProject = async (projectId, ownerId, targetUserId) => {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Project not found.");
  if (project.ownerId !== ownerId) throw new Error("Only the owner can send invites.");
  if (project.memberIds.includes(targetUserId)) throw new Error("User is already a member.");

  const existing = getProjectRequestBetweenUsers(project.id, ownerId, targetUserId, "invite");
  if (existing) return clone(existing);

  const requests = getProjectRequestsStore();
  const invite = {
    id: buildId("project-request"),
    projectId: project.id,
    senderId: ownerId,
    receiverId: targetUserId,
    type: "invite",
    status: "pending",
    createdAt: nowIso(),
  };
  requests.unshift(invite);
  saveProjectRequestsStore(requests);
  emitDataUpdate();

  const owner = await getUserProfile(ownerId);
  pushNotification(targetUserId, {
    type: "project-invite",
    title: "Project invite",
    text: `${owner.fullName} invited you to join ${project.name}.`,
    actionPath: `/dashboard/projects/${project.id}`,
  });

  return clone(invite);
};

export const respondToProjectRequest = async (requestId, userId, decision) => {
  const requests = getProjectRequestsStore();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index === -1) throw new Error("Project request not found.");

  const request = requests[index];
  if (request.receiverId !== userId) throw new Error("You cannot respond to this request.");

  requests[index] = {
    ...request,
    status: decision === "accept" ? "accepted" : "declined",
    respondedAt: nowIso(),
  };
  saveProjectRequestsStore(requests);

  if (decision === "accept") {
    const projects = getProjectsStore();
    const projectIndex = projects.findIndex((project) => project.id === request.projectId || project.$id === request.projectId);
    if (projectIndex !== -1) {
      const targetUserId = request.type === "invite" ? request.receiverId : request.senderId;
      projects[projectIndex] = {
        ...projects[projectIndex],
        memberIds: Array.from(new Set([...(projects[projectIndex].memberIds || []), targetUserId])),
      };
      saveProjectsStore(projects);
    }

    const project = await getProjectById(request.projectId);
    const actor = await getUserProfile(userId);
    pushNotification(request.senderId, {
      type: "project",
      title: request.type === "invite" ? "Invite accepted" : "Join request approved",
      text:
        request.type === "invite"
          ? `${actor.fullName} accepted your invite to ${project?.name || "the project"}.`
          : `${actor.fullName} approved your request for ${project?.name || "the project"}.`,
      actionPath: `/dashboard/projects/${request.projectId}`,
    });
  }

  emitDataUpdate();
  return clone(requests[index]);
};

export const createProject = async (ownerId, payload) => {
  const projects = getProjectsStore();
  const id = buildId("project");
  const project = {
    id,
    $id: id,
    name: payload.name,
    tagline: payload.tagline || "",
    description: payload.description || "",
    category: payload.category || "Student Project",
    status: payload.status || "Planning",
    visibility: payload.visibility || "Public",
    ownerId,
    memberIds: Array.from(new Set([ownerId, ...(payload.memberIds || [])])),
    requiredSkills: payload.requiredSkills || [],
    lookingFor: payload.lookingFor || [],
    dueDate: payload.dueDate || "",
    budget: Number(payload.budget || 0),
    repoUrl: payload.repoUrl || "",
    progress: 0,
    milestones: [],
    tasks: [],
    updates: [
      {
        id: buildId("update"),
        authorId: ownerId,
        text: "Project created and workspace opened for collaborators.",
        createdAt: nowIso(),
      },
    ],
  };

  projects.unshift(project);
  saveProjectsStore(projects);
  emitDataUpdate();
  return clone(hydrateProject(project));
};

export const addProjectTask = async (projectId, payload) => {
  const projects = getProjectsStore();
  const projectIndex = projects.findIndex((project) => project.id === projectId || project.$id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  const task = {
    id: buildId("task"),
    title: payload.title,
    completed: false,
    priority: payload.priority || "Medium",
    assigneeId: payload.assigneeId || null,
    dueDate: payload.dueDate || "",
  };

  projects[projectIndex] = {
    ...projects[projectIndex],
    tasks: [...(projects[projectIndex].tasks || []), task],
  };
  saveProjectsStore(projects);
  emitDataUpdate();

  return clone(task);
};

export const toggleProjectTask = async (projectId, taskId) => {
  const projects = getProjectsStore();
  const projectIndex = projects.findIndex((project) => project.id === projectId || project.$id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    tasks: (projects[projectIndex].tasks || []).map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ),
  };
  projects[projectIndex].progress = getProjectProgress(projects[projectIndex]);
  saveProjectsStore(projects);
  emitDataUpdate();

  return clone(hydrateProject(projects[projectIndex]));
};

export const addProjectUpdate = async (projectId, authorId, text) => {
  const projects = getProjectsStore();
  const projectIndex = projects.findIndex((project) => project.id === projectId || project.$id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  const update = {
    id: buildId("update"),
    authorId,
    text,
    createdAt: nowIso(),
  };

  projects[projectIndex] = {
    ...projects[projectIndex],
    updates: [update, ...(projects[projectIndex].updates || [])],
  };
  saveProjectsStore(projects);
  emitDataUpdate();

  return clone(update);
};

export const getProjectMessages = async (projectId) => {
  const project = getProjectsStore().find((entry) => entry.id === projectId || entry.$id === projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  return clone(hydrateProject(project).discussions || []);
};

export const sendProjectMessage = async (projectId, authorId, text) => {
  const projects = getProjectsStore();
  const projectIndex = projects.findIndex((project) => project.id === projectId || project.$id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  const entry = {
    id: buildId("discussion"),
    authorId,
    text,
    createdAt: nowIso(),
  };

  projects[projectIndex] = {
    ...projects[projectIndex],
    discussions: [...(projects[projectIndex].discussions || []), entry],
  };
  saveProjectsStore(projects);
  emitDataUpdate();
  return clone(entry);
};

export const updateProjectProgress = async (projectId, progress) => {
  const projects = getProjectsStore();
  const projectIndex = projects.findIndex((project) => project.id === projectId || project.$id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    progress: Math.max(0, Math.min(100, Number(progress))),
  };
  saveProjectsStore(projects);
  emitDataUpdate();

  return clone(hydrateProject(projects[projectIndex]));
};

export const getTasks = async () =>
  getProjectsStore().flatMap((project) =>
    (project.tasks || []).map((task) => ({
      ...task,
      projectId: project.id,
      project: project.name,
    }))
  );

export const getTasksByProjectId = async (projectId) => {
  const project = getProjectsStore().find((entry) => entry.id === projectId || entry.$id === projectId);
  return clone(project?.tasks || []);
};

export const getNotifications = async (userId) => {
  const notifications = getNotificationsStore();
  if (!userId) {
    return clone(notifications);
  }
  return clone((notifications[userId] || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const notifications = getNotificationsStore();
  notifications[userId] = (notifications[userId] || []).map((item) =>
    item.id === notificationId ? { ...item, unread: false } : item
  );
  saveNotificationsStore(notifications);
  emitDataUpdate();
  return clone(notifications[userId] || []);
};

export const getTimeline = async (userId) => {
  const users = Object.fromEntries(getUsers().map((user) => [user.$id, user]));
  const projects = getProjectsStore();
  const connectionEvents = getRequestsStore()
    .filter(
      (request) =>
        request.status === "accepted" &&
        (request.senderId === userId || request.receiverId === userId)
    )
    .map((request) => {
      const otherId = request.senderId === userId ? request.receiverId : request.senderId;
      return {
        id: request.id,
        time: request.respondedAt || request.createdAt,
        user: users[otherId]?.fullName || "Unknown user",
        action: "connected with",
        target: users[userId]?.fullName || "you",
        type: "connection",
      };
    });

  const projectEvents = projects
    .filter((project) => project.memberIds.includes(userId))
    .flatMap((project) =>
      (project.updates || []).map((update) => ({
        id: update.id,
        time: update.createdAt,
        user: users[update.authorId]?.fullName || "Unknown user",
        action: "posted an update in",
        target: project.name,
        type: "project",
      }))
    );

  return [...projectEvents, ...connectionEvents]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8)
    .map((item) => ({
      ...item,
      avatar: getInitials(item.user),
    }));
};

export const getSkillVerifications = async (userId) => {
  const user = await getUserProfile(userId);
  return (user.topSkills || []).map((skill, index) => ({
    skill,
    verified: index < 2,
    level: index === 0 ? "Advanced" : "Intermediate",
    method: index % 2 === 0 ? "Project Review" : "Peer Endorsement",
    score: index === 0 ? 92 : 81,
  }));
};

export const getMetrics = async (userId) => {
  const connections = await getConnections(userId);
  const projects = (await getProjects()).filter((project) => project.memberIds.includes(userId));
  const user = await getUserProfile(userId);
  const tasks = projects.flatMap((project) => project.tasks || []);
  const completedTasks = tasks.filter((task) => task.completed).length;

  return {
    projectsActive: {
      current: projects.length,
      target: Math.max(4, projects.length + 1),
      growth: 12,
    },
    collaborators: {
      current: connections.length,
      target: Math.max(8, connections.length + 2),
      growth: 18,
    },
    tasksDone: {
      current: completedTasks,
      target: Math.max(10, completedTasks + 3),
      growth: 9,
    },
    profileStrength: {
      current: Math.min(
        100,
        45 +
          (user.bio ? 15 : 0) +
          Math.min(20, (user.topSkills?.length || 0) * 5) +
          (user.github ? 10 : 0) +
          (user.linkedin ? 10 : 0)
      ),
      target: 100,
      growth: 6,
    },
  };
};

export const getTeamMembers = async () => getUsers().map(withUserMeta);

export const getDashboardSnapshot = async (userId) => {
  const [
    profile,
    metrics,
    pendingRequests,
    projectInvites,
    incomingProjectRequests,
    connections,
    notifications,
    timeline,
    projects,
  ] =
    await Promise.all([
      getUserProfile(userId),
      getMetrics(userId),
      getPendingRequests(userId),
      getProjectInvitesForUser(userId),
      getIncomingProjectRequests(userId),
      getConnections(userId),
      getNotifications(userId),
      getTimeline(userId),
      getProjects(),
    ]);

  const myProjects = projects.filter((project) => project.memberIds.includes(userId));

  return {
    profile,
    metrics,
    pendingRequests,
    projectInvites,
    incomingProjectRequests,
    connections,
    notifications,
    timeline,
    myProjects,
    activeProject: myProjects[0] || null,
  };
};

export const getUserSettings = async (userId) => {
  const settingsMap = getSettingsMap();
  if (!settingsMap[userId]) {
    const user = await getUserProfile(userId);
    settingsMap[userId] = createDefaultSettings(user);
    saveSettingsMap(settingsMap);
  }
  return clone(settingsMap[userId]);
};

export const updateUserSettings = async (userId, settings) => {
  const settingsMap = getSettingsMap();
  settingsMap[userId] = clone(settings);
  saveSettingsMap(settingsMap);
  emitDataUpdate();
  return clone(settings);
};

export const uploadProfilePicture = async (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ fileId: buildId("file"), fileUrl: reader.result });
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

export const requestPasswordReset = async (email) => {
  const user = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("No account matches that email address.");
  }

  browserStorage?.setItem(STORAGE_KEYS.resetEmail, user.email);
  return { ok: true };
};

export const confirmPasswordReset = async (userId, secret, password) => {
  const users = getUsers();
  const requestedEmail = browserStorage?.getItem(STORAGE_KEYS.resetEmail);
  const user = users.find(
    (entry) =>
      entry.$id === userId || entry.id === userId || (requestedEmail && entry.email === requestedEmail)
  );

  if (!user) {
    throw new Error("Reset request not found.");
  }

  user.password = password;
  saveUsers(users);
  browserStorage?.removeItem(STORAGE_KEYS.resetEmail);
  emitDataUpdate();
  return { ok: true, secret };
};
