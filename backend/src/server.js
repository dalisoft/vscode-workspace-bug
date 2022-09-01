import { getUserId } from "@shared/api/src/auth";



const server = () => {

}

server.auth = () => {
  const authId = getUserId();
}
