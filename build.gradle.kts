import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.7.10"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.7.22"
	kotlin("plugin.spring") version "1.7.22"
	kotlin("plugin.jpa") version "1.7.22"
	kotlin("kapt") version "1.7.22"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	// JWT
	implementation("com.auth0:java-jwt:3.19.2")
	implementation("at.favre.lib:bcrypt:0.9.0")

	// LOGGING
	implementation("io.github.microutils:kotlin-logging:1.12.5")

	// REACTIVE SERVER
	implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
	implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
	implementation("org.springframework.boot:spring-boot-starter-webflux")

	// KOTLIN
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	kapt("org.springframework.boot:spring-boot-configuration-processor")
	implementation("org.springframework.boot:spring-boot-configuration-processor")

	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	implementation("org.yaml:snakeyaml:1.29")


	// COROUTINE
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")

	// DB
	runtimeOnly("org.postgresql:postgresql")
	runtimeOnly("org.postgresql:r2dbc-postgresql")

	// TEST
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")


	implementation("org.springframework.boot:spring-boot-starter")

}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
