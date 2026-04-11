package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectRequest;
import com.skillcollab.platform.domain.ProjectRequestStatus;
import com.skillcollab.platform.domain.ProjectRequestType;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, String> {

    List<ProjectRequest> findByReceiverAndTypeAndStatusOrderByCreatedAtDesc(UserAccount receiver, ProjectRequestType type, ProjectRequestStatus status);

    Optional<ProjectRequest> findByProjectAndSenderAndReceiverAndTypeAndStatus(Project project, UserAccount sender, UserAccount receiver,
                                                                               ProjectRequestType type, ProjectRequestStatus status);

    List<ProjectRequest> findByProjectAndReceiverAndTypeAndStatusOrderByCreatedAtDesc(Project project, UserAccount receiver,
                                                                                       ProjectRequestType type, ProjectRequestStatus status);
}
