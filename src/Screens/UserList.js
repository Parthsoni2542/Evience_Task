import { useDispatch, useSelector } from "react-redux";
import UserListComponent from "../components/UserListComponent"
import { fetchUsersFailure, fetchUsersRequest, fetchUsersSuccess } from "../Redux/action/action";
import { useEffect } from "react";
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const UserList = () => {
    const dispatch = useDispatch();
    const { type, isConnected } = useNetInfo();
    console.log("isConnected", isConnected)
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isConnected == null) {
                FetchOnlineRequest()
            } else if (isConnected == true) {
                FetchOnlineRequest()
            } else {
                getLocalStore()
            }
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation, isConnected]);






    const FetchOnlineRequest = () => {
        dispatch(fetchUsersRequest());
        fetch('https://reqres.in/api/users?page=1')
            .then((response) => response.json())
            .then(async (data) => dispatch(
                await fetchUsersSuccess(data.data),
                await AsyncStorage.setItem('users', JSON.stringify(data.data)),

            ))
            .catch((error) => dispatch(fetchUsersFailure(error.message)));
    }


    const getLocalStore = async () => {
        const storedUsers = await AsyncStorage.getItem('users');
        console.log("offlineData", storedUsers)
        if (storedUsers) {
            dispatch(fetchUsersSuccess(JSON.parse(storedUsers)));
        } else {
            dispatch(fetchUsersFailure('No internet connection and no local data available.'));
        }
    }



    return (
        <UserListComponent />
    )
}
export default UserList;