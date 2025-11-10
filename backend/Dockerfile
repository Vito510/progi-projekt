FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/*.jar backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]
