package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {

    List<Project> findDistinctByMembersContainingOrOwnerOrderByCreatedAtDesc(UserAccount member, UserAccount owner);
}
