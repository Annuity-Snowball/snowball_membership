package com.example.membershipserver.service

import com.example.membershipserver.domain.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val  userRepository: UserRepository
) {

    suspend fun signUp() {

    }

    suspend fun signIn() {

    }

    suspend fun logout() {

    }

    suspend fun getByToken() {

    }
}