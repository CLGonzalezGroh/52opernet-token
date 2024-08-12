const { execSync } = require("child_process")
const jwt = require("jsonwebtoken")

// Generar NEXTAUTH_SECRET usando openssl
const nextAuthSecret = execSync("openssl rand -base64 32").toString().trim()

// Crear un apiToken basado en el NEXTAUTH_SECRET
const payload = {
  id: 1,
  roles: [1],
}

const apiToken = jwt.sign(payload, nextAuthSecret, {
  algorithm: "HS256",
  //   expiresIn: "9999 years", // No expira
})

console.log("\n")
console.log("Variables de entorno a reemplazar en la aplicación Web:")
console.log("-------------------------------------------------------")
console.log(`🔑 NEXTAUTH_SECRET=${nextAuthSecret}`)
console.log(`🔑 VIEW_ONLY_TOKEN=Bearer ${apiToken}`)
console.log("\n")
console.log("Variable de entorno a reemplazar en las APIs:")
console.log("-------------------------------------------------------")
console.log(`🔑 AUTH_JWT_SECRET=${nextAuthSecret}`)
