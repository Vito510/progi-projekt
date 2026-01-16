package hr.fer.progi.progi_projekt.service;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;
import hr.fer.progi.progi_projekt.security.JwtUtil;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
@ActiveProfiles("test")
public class UserProfileServiceTest {

    @Autowired
    private UserProfileService userProfileService;

    JwtUtil jwtUtil = new JwtUtil();

    @Test
    void getUserProfileByEmail() {
        // postoji li profil sa email-om test1@gmail.com
        UserProfile userProfile = new UserProfile("test1","test1@gmail.com", Role.USER);
        userProfileService.saveUserProfile(userProfile);

        assertThat(userProfileService.getUserProfileByEmail("test1@gmail.com").getEmail()).isEqualTo("test1@gmail.com");
    }

    @Test
    void createProfile() {
        // kreiraj profil test2
        String token = jwtUtil.generateToken("test2@gmail.com");

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        userProfileService.createProfile("test2", request);
        var user = userProfileService.getUserProfileByEmail("test2@gmail.com");
        System.out.println(user);
        assertThat(user.getEmail()).isEqualTo("test2@gmail.com");
    }

    @Test
    void createExistingProfile() {
        // napravi profil test3
        String token = jwtUtil.generateToken("test3@gmail.com");

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        userProfileService.createProfile("test3", request);
        // pokusaj napraviti profil sa istim email-om
        userProfileService.createProfile("test4", request);

        assertThat(userProfileService.userExistsByUsername("test4")).isFalse();
    }

    @Test
    void editExistingProfile() {
        // napravi profil test5
        UserProfile userProfile = new UserProfile("test5", "test5@gmail.com", Role.USER);
        String token = jwtUtil.generateToken(userProfile.getEmail());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        userProfileService.createProfile(userProfile.getUsername(), request);

        // promjeni mu ime u Vito
        userProfile = userProfileService.getUserProfileByEmail(userProfile.getEmail());
        userProfile.setUsername("Vito");
        userProfileService.editProfile(userProfile);

        assertThat(userProfileService.userExistsByUsername("Vito") && !userProfileService.userExistsByUsername("test5")).isTrue();
    }



}
