package com.nhom17.userservice.api;

import com.nhom17.userservice.http.HeaderGenerator;
import com.nhom17.userservice.service.RoleService;
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

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/role")
@Tag(
    name = "User Role API",
    description = "Operations related to user roles"
)
public class UserRole {

    private final RoleService roleService;
    private final HeaderGenerator headerGenerator;

    @Autowired
    public UserRole(RoleService roleService, HeaderGenerator headerGenerator) {
        this.roleService = roleService;
        this.headerGenerator = headerGenerator;
    }

    @Operation(
        summary = "Assign roles to user",
        description = "Assign roles to a user with the specified ID."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Roles assigned successfully",
            content = @Content(schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "Bad Request",
            content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/{id}/assign-roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> assignRoles(@PathVariable Long id, @RequestBody String roleNames) {
        boolean success = roleService.assignRole(id, roleNames);
        if (success) {
            return new ResponseEntity<>("Roles have been assigned to users with IDs " + id,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>("Has full rights for the User" + id,
                headerGenerator.getHeadersForError(),
                HttpStatus.OK);
    }

    @Operation(
        summary = "Revoke roles from user",
        description = "Revoke roles from a user with the specified ID."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Roles revoked successfully",
            content = @Content(schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "Bad Request",
            content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/{id}/revoke-roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> revokeRoles(@PathVariable Long id, @RequestBody String roleNames) {
        boolean success = roleService.revokeRole(id, roleNames);
        if (success) {
            return new ResponseEntity<>("Roles have been assigned to users with IDs " + id,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>("Has full rights for the User" + id,
                headerGenerator.getHeadersForError(),
                HttpStatus.OK);
    }

    @Operation(
        summary = "Get user roles",
        description = "Retrieve roles assigned to a user with the specified ID."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User roles retrieved successfully",
            content = @Content(schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = ResponseEntity.class)))
    })
    @GetMapping("/{id}/user-roles")
    public ResponseEntity<List<String>> getUserRoles(@PathVariable Long id) {
        List<String> userRoles = roleService.getUserRoles(id);
        return new ResponseEntity<>(userRoles,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

}
