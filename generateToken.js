const { execSync } = require("child_process")
const jwt = require("jsonwebtoken")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let nextAuthSecret = ""
// Payload para View Only
const payload = {
  id: 1,
  roles: [1],
}
// Payload para RINO
const payloadRino = {
  id: 98,
  roles: [1, 9],
}

rl.question(
  "¿Desea generar un nuevo secret key (n) o utilizar uno existente (e) (n/e): ",
  (answer) => {
    if (answer === "n") {
      // Generar secreto usando openssl
      nextAuthSecret = execSync("openssl rand -base64 32").toString().trim()
      // Crear los apiTokens basado en el secreto
      const { apiToken, apiTokenRino } = createTokens(nextAuthSecret)
      console.log("\n")
      console.log(
        "🟢 Se genera un nuevo secret key y los tokens de acceso asociados:"
      )
      printTokens({ apiToken, apiTokenRino, nextAuthSecret })
      rl.close()
    } else {
      rl.question("Por favor, ingresa el secret: ", (secret) => {
        nextAuthSecret = secret
        // Crear los apiTokens basado en el secreto
        const { apiToken, apiTokenRino } = createTokens(nextAuthSecret)
        console.log("\n")
        console.log(
          "🟢 Se utilizó el secret key ingresado para crear los tokens de acceso asociados:"
        )
        printTokens({ apiToken, apiTokenRino, nextAuthSecret })
        rl.close()
      })
    }
  }
)

// Crear los apiTokens basado en el secreto
function createTokens(secret) {
  const apiToken = jwt.sign(payload, secret, {
    algorithm: "HS256",
  })

  const apiTokenRino = jwt.sign(payloadRino, secret, {
    algorithm: "HS256",
  })
  return { apiToken, apiTokenRino }
}

// Imprimir los tokens y secretos
function printTokens({ apiToken, apiTokenRino, nextAuthSecret }) {
  console.log("\n")
  console.log("Variables de entorno a reemplazar en la aplicación Web:")
  console.log("-------------------------------------------------------")
  console.log(`🔑 NEXTAUTH_SECRET=${nextAuthSecret}`)
  console.log(`🔑 VIEW_ONLY_TOKEN=Bearer ${apiToken}`)
  console.log("\n")
  console.log("Variable de entorno a reemplazar en las APIs:")
  console.log("---------------------------------------------")
  console.log(`🔑 AUTH_JWT_SECRET=${nextAuthSecret}`)
  console.log("\n")
  console.log("API Token de acceso para RINO:")
  console.log("------------------------------")
  console.log(`🔑 Bearer ${apiTokenRino}`)
  console.log("\n")
}
