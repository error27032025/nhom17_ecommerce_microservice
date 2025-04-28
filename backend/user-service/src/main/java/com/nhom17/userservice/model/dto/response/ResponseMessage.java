package com.nhom17.userservice.model.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import jakarta.validation.constraints.Size;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ResponseMessage {
    @Size(min = 10, max = 500)
    private String message;
}