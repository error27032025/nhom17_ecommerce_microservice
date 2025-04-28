package com.nhom17.userservice.config;

import com.nhom17.userservice.security.jwt.JwtEntryPoint;
import com.nhom17.userservice.security.jwt.JwtTokenFilter;
import com.nhom17.userservice.security.userprinciple.UserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    private final UserDetailService userDetailService;
    private final JwtEntryPoint jwtEntryPoint;

    public WebSecurityConfig(UserDetailService userDetailService, JwtEntryPoint jwtEntryPoint) {
        this.userDetailService = userDetailService;
        this.jwtEntryPoint = jwtEntryPoint;
    }

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF (thường dùng cho API RESTful)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Cho phép tất cả yêu cầu đến /api/auth/**
                .requestMatchers("/api/manager/token").permitAll() // Cho phép tất cả yêu cầu đến /api/manager/token
                .requestMatchers("/api/manager/change-password").authenticated() // Yêu cầu xác thực cho /api/manager/change-password
                .requestMatchers("/api/manager/delete/**").authenticated() // Yêu cầu xác thực cho /api/manager/delete/**
                .requestMatchers("/api/auth/logout").authenticated() // Yêu cầu xác thực cho /api/auth/logout
                .requestMatchers("/api/manager/user/**").permitAll() // Cho phép tất cả yêu cầu đến /api/manager/user/**
                .requestMatchers("/v2/api-docs", "/swagger-ui/**", "/swagger-resources/**", "/webjars/**").permitAll() // Cho phép tất cả yêu cầu đến swagger ui và api-docs
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v2/api-docs", "/swagger-resources/**", "/webjars/**").permitAll() // Thêm các URL swagger khác
                .anyRequest().permitAll() // Các yêu cầu còn lại đều được phép
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Quản lý session không trạng thái
            .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(jwtEntryPoint)) // Xử lý lỗi xác thực
            .authenticationProvider(authenticationProvider()) // Sử dụng custom AuthenticationProvider
            .addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class); // Thêm filter JWT trước filter của Spring Security

        return http.build(); // Trả về đối tượng SecurityFilterChain
    }
}
