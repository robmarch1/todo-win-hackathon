package uk.co.cdl.hackathon.todowin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Endpoints {

    @RequestMapping("/hello")
    public String helloWorld() {
        return "Yo";
    }
}
