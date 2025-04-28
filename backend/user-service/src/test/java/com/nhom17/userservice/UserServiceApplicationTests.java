package com.nhom17.userservice;

import com.nhom17.userservice.exception.wrapper.EmailOrUsernameNotFoundException;
import com.nhom17.userservice.exception.wrapper.PhoneNumberNotFoundException;
import com.nhom17.userservice.model.dto.request.SignUp;
import com.nhom17.userservice.model.entity.Role;
import com.nhom17.userservice.model.entity.RoleName;
import com.nhom17.userservice.model.entity.User;
import com.nhom17.userservice.repository.UserRepository;
import com.nhom17.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;



@SpringBootTest
public class UserServiceApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserService userService;

	private SignUp signUp;

	@BeforeEach
	void setUp() {
		SignUp signUp = new SignUp();
		signUp.setAvatar("https://www.google.com.vn/imgres?q=image&imgurl=https%3A%2F%2Fletsenhance.io%2Fstatic%2F73136da51c245e80edc6ccfe44888a99%2F1015f%2FMainBefore.jpg&imgrefurl=https%3A%2F%2Fletsenhance.io%2F&docid=-t22bY2ix3gHaM&tbnid=D2e1clQQJsbJwM&vet=12ahUKEwiQuqmd_fGMAxVeS2wGHSrFEHQQM3oECBwQAA..i&w=1280&h=720&hcb=2&itg=1&ved=2ahUKEwiQuqmd_fGMAxVeS2wGHSrFEHQQM3oECBwQAA");
		signUp.setUsername("user1");
		signUp.setEmail("test@gmail.com");
		signUp.setPhone("0236589745");
		signUp.setPassword("123456qQ");
		signUp.setGender("Nam");
		signUp.setFullname("ABBBBB");
	}

	@Test
	void testRegisterWithDatabase() {
		// Tạo đối tượng SignUp
		SignUp signUp = new SignUp();
		signUp.setAvatar("https://www.google.com.vn/imgres?q=image&imgurl=https%3A%2F%2Fletsenhance.io%2Fstatic%2F73136da51c245e80edc6ccfe44888a99%2F1015f%2FMainBefore.jpg&imgrefurl=https%3A%2F%2Fletsenhance.io%2F&docid=-t22bY2ix3gHaM&tbnid=D2e1clQQJsbJwM&vet=12ahUKEwiQuqmd_fGMAxVeS2wGHSrFEHQQM3oECBwQAA..i&w=1280&h=720&hcb=2&itg=1&ved=2ahUKEwiQuqmd_fGMAxVeS2wGHSrFEHQQM3oECBwQAA");
		signUp.setUsername("user1");
		signUp.setEmail("test@gmail.com");
		signUp.setPhone("0236589745");
		signUp.setPassword("123456qQ");
		signUp.setGender("Nam");
		signUp.setFullname("ABBBBB");
		signUp.setRoles(new HashSet<>(Arrays.asList("USER")));

		// Chuyển từ Set<String> sang Set<Role> (RoleName là enum của bạn)
		Set<Role> roles = signUp.getRoles().stream()
				.map(roleName -> {
					Role role = new Role();
					role.setName(RoleName.valueOf(roleName)); // Chuyển từ String sang RoleName enum
					return role;
				})
				.collect(Collectors.toSet());

		// Đăng ký User mới
		Mono<User> registeredUser = userService.register(signUp);

		// Kiểm tra kết quả trả về với StepVerifier
		StepVerifier.create(registeredUser)
				.expectNextMatches(user -> {
					// In ra để debug (nếu cần thiết)
					System.out.println("Roles from SignUp: " + roles);
					System.out.println("Roles from User: " + user.getRoles());

					// Kiểm tra các thuộc tính của User
					assertNotNull(user);
					assertEquals("user1", user.getUsername()); // Kiểm tra username
					assertEquals("test@gmail.com", user.getEmail()); // Kiểm tra email

					// So sánh tên vai trò thay vì toàn bộ đối tượng Role
					boolean rolesMatch = user.getRoles().stream()
							.map(role -> role.getName().name()) // Lấy tên vai trò
							.collect(Collectors.toSet())
							.containsAll(roles.stream()
									.map(role -> role.getName().name())  // Lấy tên từ signUp
									.collect(Collectors.toSet()));

					assertTrue(rolesMatch);  // Kiểm tra sự khớp vai trò
					return true;
				})
				.expectComplete()
				.verify();
	}

	@Test
	void testRegisterUsernameAlreadyExists() {
		// Tạo một user đã tồn tại trong database
		User existingUser = new User();
		existingUser.setUsername("user1");
		existingUser.setEmail("user1@example.com");
		existingUser.setPassword("password123");
		existingUser.setPhone("123456789");
		userRepository.save(existingUser);  // Lưu vào cơ sở dữ liệu trước khi kiểm tra

		// Tạo SignUp mới với username đã tồn tại
		signUp.setUsername("user1");

		// Kiểm tra lỗi trả về khi đăng ký với username đã tồn tại
		Mono<User> userMono = userService.register(signUp);

		StepVerifier.create(userMono)
				.expectErrorMatches(throwable -> throwable instanceof EmailOrUsernameNotFoundException &&
						throwable.getMessage().contains("The username user1 is existed, please try again."))
				.verify();
	}

	@Test
	void testRegisterEmailAlreadyExists() {
		// Tạo một user đã tồn tại với email đã đăng ký
		User existingUser = new User();
		existingUser.setUsername("user2");
		existingUser.setEmail("user1@example.com");
		existingUser.setPassword("password123");
		existingUser.setPhone("987654321");
		userRepository.save(existingUser);

		// Tạo SignUp mới với email đã tồn tại
		signUp.setEmail("user1@example.com");

		// Kiểm tra lỗi khi đăng ký với email đã tồn tại
		Mono<User> userMono = userService.register(signUp);

		StepVerifier.create(userMono)
				.expectErrorMatches(throwable -> throwable instanceof EmailOrUsernameNotFoundException &&
						throwable.getMessage().contains("The email user1@example.com is existed, please try again."))
				.verify();
	}

	@Test
	void testRegisterPhoneAlreadyExists() {
		// Tạo một user đã tồn tại với số điện thoại đã đăng ký
		User existingUser = new User();
		existingUser.setUsername("user3");
		existingUser.setEmail("user3@example.com");
		existingUser.setPassword("password123");
		existingUser.setPhone("123456789");
		userRepository.save(existingUser);

		// Tạo SignUp mới với số điện thoại đã tồn tại
		signUp.setPhone("123456789");

		// Kiểm tra lỗi khi đăng ký với số điện thoại đã tồn tại
		Mono<User> userMono = userService.register(signUp);

		StepVerifier.create(userMono)
				.expectErrorMatches(throwable -> throwable instanceof PhoneNumberNotFoundException &&
						throwable.getMessage().contains("The phone number 123456789 is existed, please try again."))
				.verify();
	}
}
