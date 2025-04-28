package com.nhom17.userservice.api;

import com.nhom17.userservice.model.dto.request.Login;
import com.nhom17.userservice.model.dto.request.SignUp;
import com.nhom17.userservice.model.dto.response.*;
import com.nhom17.userservice.security.jwt.JwtProvider;
import com.nhom17.userservice.security.validate.AuthorityTokenUtil;
import com.nhom17.userservice.security.validate.TokenValidate;
import com.nhom17.userservice.service.EmailService;
import com.nhom17.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@Tag(name = "User Authentication API",
        description = "APIs for user registration, login, and authentication")
public class UserAuth {

    private final UserService userService;
    private final JwtProvider jwtProvider;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TokenValidate validate;

    @Autowired
    public UserAuth(UserService userService, JwtProvider jwtProvider) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
    }

    @Operation(
            summary = "Register a new user",
            description = "Registers a new user with the provided details."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @PostMapping({"/signup", "/register"})
    public Mono<ResponseEntity<RegisterMessage>> register(@Valid @RequestBody SignUp signUp) {
        return userService.register(signUp)
            .flatMap(registerMessage -> {
                // Return ResponseEntity with RegisterMessage and status CREATED
                return Mono.just(new ResponseEntity<>(registerMessage, HttpStatus.CREATED));
            })
            .onErrorResume(error -> {
                // Handle errors and return an error message
                RegisterMessage errorResponse = RegisterMessage.builder()
                    .message("Error occurred while creating the account: " + error.getMessage())
                    .build();
                return Mono.just(new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
            });
    }

    @Operation(
            summary = "User login",
            description = "Logs in a user with the provided credentials."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @PostMapping({"/signin", "/login"})
    public Mono<ResponseEntity<JwtResponseMessage>> login(@Valid @RequestBody Login signInForm) {
        if (signInForm.getUsername() == null || signInForm.getUsername().isEmpty()) {
            return Mono.just(new ResponseEntity<>(new JwtResponseMessage(null, null, new InformationMessage("Username or Email cannot be null or empty")),
                HttpStatus.BAD_REQUEST));
        }

        return userService.login(signInForm)
            .map(ResponseEntity::ok)
            .onErrorResume(error -> {
                JwtResponseMessage errorjwtResponseMessage = new JwtResponseMessage(
                    null,
                    null,
                    new InformationMessage(error.getMessage())
                );
                return Mono.just(new ResponseEntity<>(errorjwtResponseMessage, HttpStatus.UNAUTHORIZED)); // 401 for Unauthorized
            });
    }

    @Operation(
            summary = "User logout",
            description = "Logs out the authenticated user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logged out successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated() and hasAuthority('USER')")
    public Mono<ResponseEntity<String>> logout() {
        log.info("Logout endpoint called");
        return userService.logout()
                .then(Mono.just(new ResponseEntity<>("Logged out successfully.", HttpStatus.OK)))
                .onErrorResume(error -> {
                    log.error("Logout failed", error);
                    return Mono.just(new ResponseEntity<>("Logout failed.", HttpStatus.BAD_REQUEST));
                });
    }

    @Operation(
            summary = "Validate JWT token",
            description = "Validates the provided JWT token."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token is valid",
                    content = @Content(schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = TokenValidationResponse.class)))
    })
    @GetMapping({"/validateToken", "/validate-token"})
    public ResponseEntity<TokenValidationResponse> validateToken(@RequestHeader(name = "Authorization") String authorizationToken) {
        if (validate.validateToken(authorizationToken)) {
            return ResponseEntity.ok(new TokenValidationResponse("Valid token"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenValidationResponse("Invalid token"));
        }
    }

    @Operation(
            summary = "Check user authority",
            description = "Checks if the user has the specified authority."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role access API",
                    content = @Content(schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = TokenValidationResponse.class)))
    })
    @GetMapping({"/hasAuthority", "/authorization"})
    public ResponseEntity<TokenValidationResponse> getAuthority(@RequestHeader(name = "Authorization") String authorizationToken,
                                                                @RequestParam("requiredRole") String requiredRole) {
        try {
            AuthorityTokenUtil authorityTokenUtil = new AuthorityTokenUtil();
            List<String> authorities = authorityTokenUtil.checkPermission(authorizationToken);

            if (authorities.contains(requiredRole)) {
                return ResponseEntity.ok(new TokenValidationResponse("Role access API"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenValidationResponse("User does not have the required authority"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenValidationResponse("Invalid token"));
        }
    }
}
