package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectUpdateRepository extends JpaRepository<ProjectUpdate, String> {

    List<ProjectUpdate> findByProjectOrderByCreatedAtDesc(Project project);
}
