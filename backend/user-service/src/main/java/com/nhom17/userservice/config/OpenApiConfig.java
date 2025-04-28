package com.nhom17.userservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @io.swagger.v3.oas.annotations.info.Info(
        title = "USER-SERVICE API DOCUMENTATIONS",
        description = "API Documentation's USER-SERVICE",
        version = "1.0.0"
    )
)
@SecurityScheme(
    name = "JWT",
    type = SecuritySchemeType.APIKEY,
    in = SecuritySchemeIn.HEADER,
    paramName = "Authorization"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("JWT"))
            .info(new Info()  // Sử dụng đúng lớp Info từ io.swagger.v3.oas.models.info.Info
                .title("USER-SERVICE API DOCUMENTATIONS")
                .version("1.0.0")
                .description("API Documentation's USER-SERVICE"));
    }
}
