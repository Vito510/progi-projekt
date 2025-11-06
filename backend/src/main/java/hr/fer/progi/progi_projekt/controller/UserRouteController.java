package hr.fer.progi.progi_projekt.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.progi.progi_projekt.model.UserRoute;
import hr.fer.progi.progi_projekt.service.UserRouteService;

@RestController
public class UserRouteController {
    UserRouteService userRouteService;

    public UserRouteController(UserRouteService service){
        this.userRouteService = service;
    }

    @GetMapping("/userRoute/{id}")
    public UserRoute getUserRoute(@PathVariable int id) {
        return userRouteService.getUserRoute(id);
    }
    
    @PostMapping("/userRoute")
    public UserRoute createUserRoute(UserRoute profile){
        return userRouteService.createUserRoute(profile);
    }

    @PutMapping("/userRoute")
    public UserRoute editUserRoute(UserRoute profile){
        return userRouteService.editUserRoute(profile);
    }

    @DeleteMapping("/userRoute/{id}")
    public void deleteUserRoute(@PathVariable int id){
        userRouteService.deleteUserRoute(id);
    }
}
