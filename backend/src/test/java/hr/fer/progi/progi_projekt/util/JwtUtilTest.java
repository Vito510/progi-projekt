package hr.fer.progi.progi_projekt.util;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import hr.fer.progi.progi_projekt.security.JwtUtil;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
@ActiveProfiles("test")
public class JwtUtilTest {

    JwtUtil jwtUtil = new JwtUtil();

    @Test
    void generateJwtToken() {
        String token = jwtUtil.generateToken("test@gmail.com");
        System.out.println(token);
        assertThat(token).isNotEmpty();
    }

    @Test
    void validJwtToken() {
        String validToken = jwtUtil.generateToken("test@gmail.com");
        assertThat(jwtUtil.isTokenValid(validToken, "test@gmail.com")).isTrue();
    }

    @Test
    void invalidJwtToken() {
        String invalidToken = jwtUtil.generateToken("test2@gmail.com");
        assertThat(jwtUtil.isTokenValid(invalidToken, "test@gmail.com")).isFalse();
    }


    @Test
    void expiredJwtToken() {
        String expiredToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTc2ODE2MDU1NCwiZXhwIjoxNzY4MDk2NTU0fQ.FGEewIKe38gzen3VVYfGZ86nddD991Zdpo3DKYrr7dKELlSDGqyyBZS41CM_47BZ65jZxTYIit43nuPGL8PobQ";
        assertThat(jwtUtil.isTokenValid(expiredToken, "test")).isFalse();
    }




}
