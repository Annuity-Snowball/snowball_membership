package com.example.membershipserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
class MembershipServerApplication

fun main(args: Array<String>) {
	runApplication<MembershipServerApplication>(*args)
}
