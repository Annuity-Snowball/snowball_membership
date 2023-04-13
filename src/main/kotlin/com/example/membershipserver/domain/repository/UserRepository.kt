package com.example.membershipserver.domain.repository

import com.example.membershipserver.domain.entity.User
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface UserRepository: CoroutineCrudRepository<User, Long> {

    suspend fun findByEmail(email: String): User?
}