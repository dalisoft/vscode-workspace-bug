import { getUserId } from "@shared/api/auth/index.js";

const server = () => {

}

server.auth = () => {
  const authId = getUserId()

  console.log('Auth ID', authId);
}

await server.auth()
