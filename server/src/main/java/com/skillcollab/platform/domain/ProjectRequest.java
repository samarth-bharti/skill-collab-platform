package com.skillcollab.platform.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "project_requests")
public class ProjectRequest {

    @Id
    private String id;

    @ManyToOne(optional = false)
    private Project project;

    @ManyToOne(optional = false)
    private UserAccount sender;

    @ManyToOne(optional = false)
    private UserAccount receiver;

    @Enumerated(EnumType.STRING)
    private ProjectRequestType type;

    @Enumerated(EnumType.STRING)
    private ProjectRequestStatus status;

    private Instant createdAt;
    private Instant respondedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public UserAccount getSender() {
        return sender;
    }

    public void setSender(UserAccount sender) {
        this.sender = sender;
    }

    public UserAccount getReceiver() {
        return receiver;
    }

    public void setReceiver(UserAccount receiver) {
        this.receiver = receiver;
    }

    public ProjectRequestType getType() {
        return type;
    }

    public void setType(ProjectRequestType type) {
        this.type = type;
    }

    public ProjectRequestStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectRequestStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(Instant respondedAt) {
        this.respondedAt = respondedAt;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = EntityIds.next("project-request");
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null) {
            status = ProjectRequestStatus.PENDING;
        }
    }
}
