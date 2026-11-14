package com.nhom17.userservice.security.validate;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class TokenValidate {

    @Value("${jwt.secret}")
    private String secretKeyBase64;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        if (secretKeyBase64 == null || secretKeyBase64.isEmpty()) {
            throw new IllegalArgumentException("JWT secret key is missing in configuration.");
        }

        // Giải mã Base64 và tạo SecretKey chuẩn cho HS512
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));
    }

    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token is null or empty.");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // bỏ tiền tố Bearer
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration().after(new Date());
        } catch (ExpiredJwtException ex) {
            throw new IllegalArgumentException("Token has expired.");
        } catch (MalformedJwtException ex) {
            throw new IllegalArgumentException("Invalid token format.");
        } catch (SignatureException ex) {
            throw new IllegalArgumentException("Invalid token signature.");
        } catch (JwtException ex) {
            throw new IllegalArgumentException("Token validation failed: " + ex.getMessage());
        }
    }
}
