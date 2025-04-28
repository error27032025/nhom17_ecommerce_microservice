package com.nhom17.userservice;

import com.nhom17.userservice.model.dto.request.Login;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@TestPropertySource(locations = "classpath:application-test.yml")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LoginIntegrationTest {

    @Autowired
    private org.springframework.test.web.reactive.server.WebTestClient webTestClient;

    @Test
    void testLoginWithUsername_Success() {
        Login loginRequest = new Login("test012345", "111111qQ");

        webTestClient.post()
                .uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginRequest)
                .exchange()
                .expectStatus().isOk()  // Đảm bảo kiểm tra mã trạng thái 200 OK
                .expectBody()
                .jsonPath("$.accessToken").isNotEmpty()
                .jsonPath("$.information.username").isEqualTo("test012345");
    }


    @Test
    void testLoginWithEmail_Success() {
        Login loginRequest = new Login("test@gmail.com", "111111qQ");  // Email và mật khẩu đã có sẵn trong DB

        webTestClient.post()
                .uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginRequest)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.information.email").isEqualTo("test@gmail.com");  // Kiểm tra email trả về
    }

    @Test
    void testLogin_Fail_WrongPassword() {
        Login loginRequest = new Login("test012345", "wrongpassword");  // Sai mật khẩu

        webTestClient.post()
                .uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginRequest)
                .exchange()
                .expectStatus().is5xxServerError()  // Dự kiến sẽ trả về lỗi server
                .expectBody()
                .jsonPath("$.accessToken").doesNotExist();  // Kiểm tra accessToken không tồn tại
    }
}
