package hr.fer.progi.progi_projekt.repository;

import hr.fer.progi.progi_projekt.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserProfile, Long> {
    // Basic CRUD methods come for free (findAll, findById, save, deleteById, etc.)
    Optional<UserProfile> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}