package hr.fer.progi.progi_projekt.controller;

import hr.fer.progi.progi_projekt.security.JwtAuthFilter;
import hr.fer.progi.progi_projekt.service.UserProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(UserProfileController.class)
@AutoConfigureMockMvc(addFilters = false)
class NonExistingFunctionalityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserProfileService userProfileService;

    @Test
    void callingNonExistingEndpoint() throws Exception {
        mockMvc.perform(get("/nepostoji"))
                .andExpect(status().isNotFound());
    }
}
