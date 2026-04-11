package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, String> {

    List<ProjectTask> findByProjectOrderByCreatedAtAsc(Project project);
}
