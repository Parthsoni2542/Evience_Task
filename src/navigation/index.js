import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserDetails from "../Screens/UserDetails";
import UserList from "../Screens/UserList";

const AppContainer = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={UserList} />
            <Stack.Screen name="UserDetails" component={UserDetails} />
        </Stack.Navigator>

    );

}
export default AppContainer