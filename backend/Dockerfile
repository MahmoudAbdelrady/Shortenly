FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /app

# Copy Maven wrapper and config for dependency caching
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Download all dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

# Copy application source code
COPY src src

# Build the application JAR
RUN ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:25-jre-alpine

# Apply latest OS security patches
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Allow JVM options to be passed at runtime (e.g. Spring profile)
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
