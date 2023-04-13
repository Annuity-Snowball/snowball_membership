package com.example.membershipserver.controller

import com.example.membershipserver.model.*
import com.example.membershipserver.service.UserService
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import java.io.File

@RestController
@RequestMapping("/membership")
class UserController(
    private val userService: UserService
) {

    @PostMapping("/signUp")
    suspend fun signUp(@RequestBody request: SignUpRequest){
        userService.signUp(request)
    }

    @PostMapping("/signIn")
    suspend fun signIn(@RequestBody signInRequest: SignInRequest) : SignInResponse {
        return userService.signIn(signInRequest)
    }

    @DeleteMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    suspend fun logout(@AuthToken token : String) {
        userService.logout(token)
    }

    @GetMapping("/getMyInfo")
    suspend fun get(
        @AuthToken token: String
    ) : UserResponse {
        return UserResponse(userService.getByToken(token))
    }

    @GetMapping("/{userId}/username")
    suspend fun getUsername(
        @PathVariable userId: Long
    ) : Map<String, String>{
        return mapOf("reporter" to userService.get(userId).username)
    }

    @PutMapping("/{id}")
    suspend fun edit(
        @PathVariable id: Long,
        @ModelAttribute request: UserEditRequest,
        @AuthToken token: String
    ){
        userService.updateUsername(token, request.username)
    }
}