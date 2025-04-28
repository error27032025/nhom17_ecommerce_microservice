package com.nhom17.userservice.service.impl;

import com.nhom17.userservice.exception.wrapper.RoleNotFoundException;
import com.nhom17.userservice.exception.wrapper.UserNotFoundException;
import com.nhom17.userservice.model.entity.Role;
import com.nhom17.userservice.model.entity.RoleName;
import com.nhom17.userservice.model.entity.User;
import com.nhom17.userservice.repository.RoleRepository;
import com.nhom17.userservice.repository.UserRepository;
import com.nhom17.userservice.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.*;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Optional<Role> findByName(RoleName name) {
        return Optional.ofNullable(roleRepository.findByName(name)
                .orElseThrow(() -> new RoleNotFoundException("Role Not Found with name: " + name)));
    }

    @Transactional
    @Override
    public boolean assignRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(mapToRoleName(roleName))
                .orElseThrow(() -> new RoleNotFoundException("Role not found in system: " + roleName));

        if (user.getRoles().contains(role))
            return false;

        user.getRoles().add(role);
        userRepository.save(user);
        return true;
    }

    @Transactional
    @Override
    public boolean revokeRole(Long id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if (user.getRoles().removeIf(role -> role.name().equals(mapToRoleName(roleName)))) {
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public List<String> getUserRoles(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        List<String> roleNames = new ArrayList<>();
        user.getRoles().forEach(userRole -> roleNames.add(userRole.name().toString()));
        return roleNames;
    }

    /*private RoleName mapToRoleName(String roleName) {
        return switch (roleName) {
            case "ADMIN", "admin", "Admin" -> RoleName.ADMIN;
            case "PM", "pm", "Pm" -> RoleName.PM;
            case "USER", "user", "User" -> RoleName.USER;
            default -> null;
        };
    }*/
    private RoleName mapToRoleName(String roleName) {
        switch (roleName.toLowerCase()) {  // Chuyển về chữ thường để giảm thiểu lỗi
            case "admin":
                return RoleName.ADMIN;
            case "pm":
                return RoleName.PM;
            case "user":
                return RoleName.USER;
            default:
                return null;
        }
    }


}