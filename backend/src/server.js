import { getUserId } from "@shared/api/auth";



const server = () => {

}

server.auth = () => {
  const authId = getUserId();
}
