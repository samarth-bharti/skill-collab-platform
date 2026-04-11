package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.ConnectionRequestStatus;
import com.skillcollab.platform.domain.DirectMessage;
import com.skillcollab.platform.domain.NotificationType;
import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectMessage;
import com.skillcollab.platform.domain.ProjectRequest;
import com.skillcollab.platform.domain.ProjectRequestStatus;
import com.skillcollab.platform.domain.ProjectRequestType;
import com.skillcollab.platform.domain.ProjectTask;
import com.skillcollab.platform.domain.ProjectUpdate;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.domain.UserSettings;
import com.skillcollab.platform.dto.SettingsDtos;
import com.skillcollab.platform.repository.ConnectionRequestRepository;
import com.skillcollab.platform.repository.DirectMessageRepository;
import com.skillcollab.platform.repository.ProjectMessageRepository;
import com.skillcollab.platform.repository.ProjectRepository;
import com.skillcollab.platform.repository.ProjectRequestRepository;
import com.skillcollab.platform.repository.ProjectTaskRepository;
import com.skillcollab.platform.repository.ProjectUpdateRepository;
import com.skillcollab.platform.repository.UserAccountRepository;
import com.skillcollab.platform.repository.UserSettingsRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;

@Service
public class SeedDataService {

    private final UserAccountRepository userAccountRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final DirectMessageRepository directMessageRepository;
    private final ProjectRepository projectRepository;
    private final ProjectTaskRepository projectTaskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final ProjectMessageRepository projectMessageRepository;
    private final ProjectRequestRepository projectRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final NotificationService notificationService;

    public SeedDataService(UserAccountRepository userAccountRepository,
                           UserSettingsRepository userSettingsRepository,
                           ConnectionRequestRepository connectionRequestRepository,
                           DirectMessageRepository directMessageRepository,
                           ProjectRepository projectRepository,
                           ProjectTaskRepository projectTaskRepository,
                           ProjectUpdateRepository projectUpdateRepository,
                           ProjectMessageRepository projectMessageRepository,
                           ProjectRequestRepository projectRequestRepository,
                           PasswordEncoder passwordEncoder,
                           DtoMapper dtoMapper,
                           NotificationService notificationService) {
        this.userAccountRepository = userAccountRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.directMessageRepository = directMessageRepository;
        this.projectRepository = projectRepository;
        this.projectTaskRepository = projectTaskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
        this.projectMessageRepository = projectMessageRepository;
        this.projectRequestRepository = projectRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public void seed() {
        if (userAccountRepository.count() > 0) {
            return;
        }

        UserAccount alex = user("alex@skillcollab.dev", "Alex Mercer", "Frontend Engineer", "Pune, India", List.of("React", "Tailwind", "Product Thinking"));
        UserAccount maya = user("maya@skillcollab.dev", "Maya Chen", "Product Designer", "Bengaluru, India", List.of("Figma", "Research", "Design Systems"));
        UserAccount omar = user("omar@skillcollab.dev", "Omar Khan", "Backend Architect", "Hyderabad, India", List.of("Spring Boot", "System Design", "PostgreSQL"));
        UserAccount rina = user("rina@skillcollab.dev", "Rina Patel", "Growth & Community", "Ahmedabad, India", List.of("Community", "Content", "Growth"));
        UserAccount sana = user("sana@skillcollab.dev", "Sana Iqbal", "ML Engineer", "Delhi, India", List.of("Python", "ML", "Prompt Design"));
        UserAccount neel = user("neel@skillcollab.dev", "Neel Desai", "Mobile Developer", "Mumbai, India", List.of("React Native", "Firebase", "UX"));

        userAccountRepository.saveAll(List.of(alex, maya, omar, rina, sana, neel));
        List.of(alex, maya, omar, rina, sana, neel).forEach(user -> userSettingsRepository.save(defaultSettings(user)));

        connection(alex, maya, ConnectionRequestStatus.ACCEPTED, Instant.parse("2026-03-10T12:00:00Z"));
        connection(alex, omar, ConnectionRequestStatus.ACCEPTED, Instant.parse("2026-03-09T12:00:00Z"));
        connection(sana, alex, ConnectionRequestStatus.PENDING, null);
        connection(alex, rina, ConnectionRequestStatus.PENDING, null);

        message(maya, alex, "I turned the onboarding rough notes into a cleaner flow. Want the draft?", Instant.parse("2026-04-08T09:15:00Z"));
        message(alex, maya, "Yes please. Also add one version for students joining without prior teammates.", Instant.parse("2026-04-08T09:22:00Z"));
        message(omar, alex, "Spring Boot API contract is ready when you want to wire the frontend.", Instant.parse("2026-04-10T15:30:00Z"));

        Project skillSync = project("SkillSync Platform", "A collaboration network where students connect and ship together.",
                "Build the full student networking and project collaboration experience.",
                "Web Platform", "In Progress", "Public", alex, List.of(alex, maya, omar),
                List.of("React", "UI Design", "Spring Boot", "Product Strategy"), List.of("QA Engineer", "Community Lead"), LocalDate.parse("2026-05-18"));

        Project peerPath = project("PeerPath Mentor Match", "Mentors, peer groups, and accountability in one student app.",
                "A platform that matches students with mentors, peer circles, and progress rituals.",
                "Community Product", "Planning", "Campus", rina, List.of(rina, sana),
                List.of("Growth", "ML", "UX Research"), List.of("Frontend Engineer", "Backend Engineer"), LocalDate.parse("2026-06-02"));

        Project shipMate = project("ShipMate Mobile", "A mobile accountability app for project streaks.",
                "Students log project sessions, daily wins, and progress streaks with friends.",
                "Mobile App", "Open for Members", "Public", neel, List.of(neel, maya),
                List.of("React Native", "Motion Design", "Growth"), List.of("Backend Engineer", "Community Manager"), LocalDate.parse("2026-05-30"));

        task(skillSync, alex, "Ship dashboard home, discover, chat, and settings surfaces", true, "High", LocalDate.parse("2026-04-05"));
        task(skillSync, omar, "Define Spring Boot API contracts for auth, projects, and chat", false, "High", LocalDate.parse("2026-04-15"));
        task(skillSync, maya, "Finalize collaboration request and connection states", true, "Medium", LocalDate.parse("2026-04-04"));
        task(peerPath, rina, "Collect 20 discovery interviews", true, "High", LocalDate.parse("2026-04-02"));
        task(peerPath, sana, "Draft a mentor recommendation prototype", false, "Medium", LocalDate.parse("2026-04-20"));
        task(shipMate, maya, "Define streak dashboard interactions", false, "Medium", LocalDate.parse("2026-04-22"));

        update(skillSync, maya, "Shared the dashboard wireframes for discover, chat, and projects.", Instant.parse("2026-04-07T11:00:00Z"));
        update(skillSync, alex, "Connected local storage flows and prepared the backend model.", Instant.parse("2026-04-09T10:30:00Z"));
        update(peerPath, rina, "Interview synthesis says accountability and warm introductions matter most.", Instant.parse("2026-04-08T14:00:00Z"));
        update(shipMate, neel, "Onboarding is in place and now the team is moving into streak logic and social loops.", Instant.parse("2026-04-06T18:00:00Z"));

        projectMessage(skillSync, alex, "We should keep the frontend contracts stable so Spring Boot integration is mostly wiring.", Instant.parse("2026-04-10T09:20:00Z"));
        projectMessage(skillSync, omar, "Agreed. I will mirror the local model in DTOs and controllers next.", Instant.parse("2026-04-10T09:25:00Z"));

        ProjectRequest joinRequest = new ProjectRequest();
        joinRequest.setProject(shipMate);
        joinRequest.setSender(alex);
        joinRequest.setReceiver(neel);
        joinRequest.setType(ProjectRequestType.JOIN_REQUEST);
        joinRequest.setStatus(ProjectRequestStatus.PENDING);
        projectRequestRepository.save(joinRequest);

        ProjectRequest invite = new ProjectRequest();
        invite.setProject(peerPath);
        invite.setSender(rina);
        invite.setReceiver(omar);
        invite.setType(ProjectRequestType.INVITE);
        invite.setStatus(ProjectRequestStatus.PENDING);
        projectRequestRepository.save(invite);

        notificationService.notify(alex, NotificationType.REQUEST, "New connection request", "Sana wants to connect and collaborate on AI product ideas.", "/dashboard/discover");
        notificationService.notify(alex, NotificationType.PROJECT, "Project update", "Omar pushed the backend contract draft for SkillSync Platform.", "/dashboard/projects/" + skillSync.getId());
        notificationService.notify(omar, NotificationType.PROJECT_INVITE, "Project invite", "Rina invited you to join PeerPath Mentor Match.", "/dashboard/projects/" + peerPath.getId());
    }

    private UserAccount user(String email, String fullName, String role, String location, List<String> skills) {
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFullName(fullName);
        user.setRole(role);
        user.setLocation(location);
        user.setCollege("");
        user.setHeadline("");
        user.setStatus("online");
        user.setBio("Demo seeded user for frontend and backend integration.");
        user.setAvailability("Open to collaborating");
        user.setTopSkills(skills);
        user.setInterests(List.of("Student Projects", "Open Source"));
        user.setSkillsVerified(skills.size() + 6);
        user.setEndorsements(skills.size() + 10);
        user.setGithubScore(70 + skills.size() * 4);
        return user;
    }

    private UserSettings defaultSettings(UserAccount user) {
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        settings.setProfileVisibility("community");
        settings.setShowEmail(false);
        settings.setLoginAlerts(true);
        settings.setTwoFactorEnabled(false);
        settings.setOpenToConnections(true);
        settings.setShowAvailability(true);
        settings.setAllowProjectInvites(true);
        settings.setPushEnabled(true);
        settings.setPushMessages(true);
        settings.setPushProjectUpdates(true);
        settings.setPushFriendRequests(true);
        settings.setEmailEnabled(false);
        settings.setWeeklyDigest(true);
        settings.setTheme("dark");
        settings.setAccentColor("green");
        settings.setCompactMode(false);
        settings.setAnimations(true);
        settings.setIntegrationJson(dtoMapper.writeIntegrations(List.of(
                new SettingsDtos.IntegrationView("GitHub", true, "student-builder"),
                new SettingsDtos.IntegrationView("LinkedIn", false, ""),
                new SettingsDtos.IntegrationView("Portfolio", false, "")
        )));
        return settings;
    }

    private void connection(UserAccount sender, UserAccount receiver, ConnectionRequestStatus status, Instant respondedAt) {
        ConnectionRequest request = new ConnectionRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(status);
        request.setRespondedAt(respondedAt);
        connectionRequestRepository.save(request);
    }

    private void message(UserAccount sender, UserAccount receiver, String content, Instant createdAt) {
        DirectMessage message = new DirectMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setConversationId(sender.getId().compareTo(receiver.getId()) < 0 ? sender.getId() + "_" + receiver.getId() : receiver.getId() + "_" + sender.getId());
        message.setContent(content);
        message.setRead(false);
        message.setCreatedAt(createdAt);
        directMessageRepository.save(message);
    }

    private Project project(String name, String tagline, String description, String category, String status, String visibility,
                            UserAccount owner, List<UserAccount> members, List<String> requiredSkills, List<String> lookingFor, LocalDate dueDate) {
        Project project = new Project();
        project.setName(name);
        project.setTagline(tagline);
        project.setDescription(description);
        project.setCategory(category);
        project.setStatus(status);
        project.setVisibility(visibility);
        project.setOwner(owner);
        project.setMembers(new LinkedHashSet<>(members));
        project.setRequiredSkills(requiredSkills);
        project.setLookingFor(lookingFor);
        project.setDueDate(dueDate);
        project.setProgress(0);
        return projectRepository.save(project);
    }

    private void task(Project project, UserAccount assignee, String title, boolean completed, String priority, LocalDate dueDate) {
        ProjectTask task = new ProjectTask();
        task.setProject(project);
        task.setAssignee(assignee);
        task.setTitle(title);
        task.setCompleted(completed);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        projectTaskRepository.save(task);
        long total = projectTaskRepository.findByProjectOrderByCreatedAtAsc(project).size();
        long done = projectTaskRepository.findByProjectOrderByCreatedAtAsc(project).stream().filter(ProjectTask::isCompleted).count();
        project.setProgress(total == 0 ? 0 : (int) Math.round((done * 100.0) / total));
        projectRepository.save(project);
    }

    private void update(Project project, UserAccount author, String text, Instant createdAt) {
        ProjectUpdate update = new ProjectUpdate();
        update.setProject(project);
        update.setAuthor(author);
        update.setText(text);
        update.setCreatedAt(createdAt);
        projectUpdateRepository.save(update);
    }

    private void projectMessage(Project project, UserAccount author, String text, Instant createdAt) {
        ProjectMessage message = new ProjectMessage();
        message.setProject(project);
        message.setAuthor(author);
        message.setText(text);
        message.setCreatedAt(createdAt);
        projectMessageRepository.save(message);
    }
}
