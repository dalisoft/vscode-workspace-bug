import { getUserId } from "@shared/api/auth/index.ts";

const server = () => {

}

server.auth = () => {
  const authId = getUserId()

  console.log('Auth ID', authId);
}

await server.auth()
