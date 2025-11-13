package hr.fer.progi.progi_projekt.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import hr.fer.progi.progi_projekt.repository.UserRepository;
import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.*;

@Service
public class UserProfileService {
    private final UserRepository userRepo;
    // DEBUG (umjesto ovoga podaci trebaju biti u bazi podataka)
    List<UserProfile> profileList = new ArrayList<UserProfile>(Arrays.asList(
        new UserProfile(1101, "vladimir", "vladi.mir@gmail.com", Role.ADMIN),
        new UserProfile(1234, "bananaman", "danko.bananko@gmail.com", Role.USER)
    ));

    public UserProfileService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public List<UserProfile> getAllUserProfiles() {
        return userRepo.findAll();
    }

    public boolean userExistsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    public Optional<UserProfile> getUserProfileByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public UserProfile register(UserProfile profile) {
        // TODO autorizirati
        // TODO stvoriti novi profil u bazi

        // DEBUG
        profileList.add(profile);
        return profile;
    }

    public UserProfile getProfile(int id) {
        // TODO autorizirati
        // TODO dohvatiti iz baze

        // DEBUG
        UserProfile profile = profileList.stream().filter((el) -> el.getId() == id).findFirst().orElse(new UserProfile());
        return profile;
    }

    public UserProfile editProfile(UserProfile profile) {
        // TODO autorizirati
        // TODO promijeniti u bazi

        // DEBUG
        List<Integer> ids = profileList.stream().map((el) -> el.getId()).toList();
        int index = ids.indexOf(profile.getId());
        profileList.set(index, profile);
        return profile;
    }

    public void deleteProfile(int id) {
        // TODO autorizirati
        // TODO izbrisati u bazi

        // DEBUG
        List<Integer> ids = profileList.stream().map((el) -> el.getId()).toList();
        int index = ids.indexOf(id);
        profileList.remove(index);
    }

}
