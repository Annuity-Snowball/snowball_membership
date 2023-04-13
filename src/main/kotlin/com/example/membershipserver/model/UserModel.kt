package com.example.membershipserver.model

import com.example.membershipserver.domain.entity.User
import java.time.LocalDateTime


data class UserEditRequest(
    val username: String
)
data class UserResponse(
    val id: Long,
    val username: String,
    val email: String,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
) {
    companion object {

        operator fun invoke(user: User) = with(user) {
            UserResponse(
                id = id!!,
                username = username,
                email = email,
                createdAt = createdAt,
                updatedAt = updatedAt
            )
        }
    }
}