package hr.fer.progi.progi_projekt.repository;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

@DataJpaTest
@ActiveProfiles("test")
public class UserProfileRepositoryTest {
    @Autowired
    UserProfileRepository userProfileRepository;

    @Test
    void createUserProfile() {
        UserProfile userProfile = new UserProfile("test", "test@gmail.com", Role.USER);
        userProfileRepository.save(userProfile);

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(1);
    }

    @Test
    void existsByEmail() {
        UserProfile userProfile = new UserProfile("test", "test@gmail.com", Role.USER);
        userProfileRepository.save(userProfile);

        assertThat(userProfileRepository.existsByEmail("test@gmail.com")).isTrue();
    }

    @Test
    void existsByEmailNegative() {
        assertThat(userProfileRepository.existsByEmail("test2@gmail.com")).isFalse();
    }

    @Test
    void findByEmail() {
        userProfileRepository.save(new UserProfile("findByEmail", "test@gmail.com", Role.USER));
        String userName = null;

        Optional<UserProfile> userProfile;
        userProfile = userProfileRepository.findByEmail("test@gmail.com");
        if (userProfile.isPresent()) {
            userName = userProfile.get().getUsername();
        }
        assertThat(userName).isEqualTo("findByEmail");
    }


}
