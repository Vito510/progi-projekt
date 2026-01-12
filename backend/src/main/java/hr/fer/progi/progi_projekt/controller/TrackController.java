// package hr.fer.progi.progi_projekt.controller;

// import hr.fer.progi.progi_projekt.service.TrackService;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import hr.fer.progi.progi_projekt.dto.TopTrackDto;

// import java.util.List;

// @RestController
// @RequestMapping("/track")
// public class TrackController {

//     private final TrackService trackService;

//     public TrackController(TrackService trackService) {
//         this.trackService = trackService;
//     }

//     @GetMapping("/top")
//     public List<TopTrackDto> getTopTracks() {
//         return trackService.getTopTracks();
//     }
// }