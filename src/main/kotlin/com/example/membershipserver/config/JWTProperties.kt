package com.example.membershipserver.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(value = "jwt")
data class JWTProperties (
    val issuer: String,
    val subject: String,
    val expiresTime: Long,
    val secret: String
    )