package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMessageRepository extends JpaRepository<ProjectMessage, String> {

    List<ProjectMessage> findByProjectOrderByCreatedAtAsc(Project project);
}
