package com.example.membershipserver.service

import com.auth0.jwt.interfaces.DecodedJWT
import com.example.membershipserver.config.JWTProperties
import com.example.membershipserver.domain.entity.User
import com.example.membershipserver.domain.repository.UserRepository
import com.example.membershipserver.exception.InvalidJwtTokenException
import com.example.membershipserver.exception.PasswordNotMatchedException
import com.example.membershipserver.exception.UserExistsException
import com.example.membershipserver.exception.UserNotFoundException
import com.example.membershipserver.model.SignInRequest
import com.example.membershipserver.model.SignInResponse
import com.example.membershipserver.model.SignUpRequest
import com.example.membershipserver.utils.BCryptUtils
import com.example.membershipserver.utils.JWTClaim
import com.example.membershipserver.utils.JWTUtils
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import java.time.Duration

@Service
class UserService(
    private val  userRepository: UserRepository,
    private val jwtProperties: JWTProperties,
    private val cacheManager: CacheManager<User>
) {

    companion object {
        private val CACHE_TTL = Duration.ofMinutes(1)
    }

    suspend fun signUp(signUpRequest: SignUpRequest) {
        with(signUpRequest) {
            userRepository.findByEmail(this.email)?.let {
                throw UserExistsException()
            }

            val user = User(
                email = email,
                password = BCryptUtils.hash(password),
                username = username
            )

            userRepository.save(user)
        }
    }

    suspend fun signIn(signInRequest: SignInRequest) : SignInResponse {
        return with(userRepository.findByEmail(signInRequest.email) ?: throw UserNotFoundException()) {
            val verified = BCryptUtils.verify(signInRequest.password, password)
            if(!verified) {
                throw  PasswordNotMatchedException()
            }

            val jwtClaim = JWTClaim(
                userId = id!!,
                email = email,
                username = username
            )

            val token = JWTUtils.createToken(jwtClaim, jwtProperties)

            cacheManager.awaitPut(key = token, value = this, ttl = CACHE_TTL)
            SignInResponse(
                email = email,
                username = username,
                token = token
            )
        }

    }

    suspend fun logout(token: String) {
        cacheManager.awaitEvict(token)
    }

    suspend fun getByToken(token: String): User {
        val cachedUser = cacheManager.awaitGetOrPut(key = token, ttl = CACHE_TTL) {
            val decodedJWT: DecodedJWT = JWTUtils.decode(token, jwtProperties.secret, jwtProperties.issuer)
            val userId:Long = decodedJWT.claims["userId"]?.asLong() ?: throw InvalidJwtTokenException()
            get(userId)
        }
        return cachedUser
    }

    suspend fun get(userId: Long) : User {
        return userRepository.findById(userId) ?: throw UserNotFoundException()
    }

    suspend fun updateUsername(token: String, username: String): User {
        val user = getByToken(token)

        val newUser = user.copy(username = username)

        return userRepository.save(newUser).also {
            cacheManager.awaitPut(key = token, value = it, ttl = CACHE_TTL)
        }
    }
}