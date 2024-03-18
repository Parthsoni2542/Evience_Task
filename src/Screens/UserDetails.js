import { useRoute } from "@react-navigation/native";
import UserDetailsComponent from "../components/UserDetailsComponent";
import UserListComponent from "../components/UserListComponent"

const UserDetails = (props)=>{
const route = useRoute()
    return(
        <UserDetailsComponent item={route.params.item}></UserDetailsComponent>
    )
}
export default UserDetails;