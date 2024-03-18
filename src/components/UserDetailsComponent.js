
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Text, TextInput } from 'react-native-paper';
import RNFS from 'react-native-fs';
import PushNotification from 'react-native-push-notification';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';


const UserDetailsComponent = (item) => {
    const [email, setEmail] = useState(item.item.email);
    const [firstName, setFirstName] = useState(item.item.first_name);
    const [lastName, setLastName] = useState(item.item.last_name);
    const [userID, setuserID] = useState(item.item.id);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const Navigatation = useNavigation()
    const { type, isConnected } = useNetInfo();

    useEffect(() => {
        // Fetch user data from AsyncStorage
        const fetchUserData = async () => {
            try {
                const storedUsers = await AsyncStorage.getItem('users');
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdateUser = async (userId) => {
        // Find the user within the array
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                // Update the user's data
                return {
                    ...user,
                    // Update user properties here, e.g., email, firstName, lastName
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                };
            }
            return user;
        });

        try {
            // Store the updated array back into AsyncStorage
            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            Navigatation.navigate("Home")
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleDeleteUsers = async () => {
        try {
            const response = await fetch(`https://reqres.in/api/users/${userID}`, {
                method: 'POST'
            });

            if (response.ok) {


                Alert.alert(
                    'Success',
                    'User deleted successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => Navigatation.navigate("Home"),
                            style: 'destructive',
                        },
                    ],
                );

                // Handle successful deletion here
            } else {
                Alert.alert('Error', 'Failed to delete user');
                // Handle failure to delete here
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'An error occurred while deleting user');
            // Handle error here
        }
    };

    const handleOnlineUpdateUser = () => {
        const requestBody = {
            email: email,
            first_name: firstName,
            last_name: lastName,
        };

        fetch(`https://reqres.in/api/users/${userID}`, {
            method: 'PUT', // Or 'PATCH' depending on your API requirements
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response
                console.log('Response data:', data);

                Alert.alert(
                    'Updated',
                    'successfully Updated',
                    [
                        {
                            text: 'OK',
                            onPress: () => Navigatation.navigate("Home"),
                            style: 'destructive',
                        },
                    ],
                );

                // Perform any actions based on the response
                //   Alert.alert('Success', 'User data updated successfully.');
            })
            .catch(error => {
                // Handle error
                console.error('There was a problem with your fetch operation:', error);
                Alert.alert('Error', 'There was a problem with your request. Please try again later.');
            });
    };


    const handleRemoveUser = async (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);

        try {
            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            Navigatation.navigate("Home")
        } catch (error) {
            // console.error('Error removing user:', error);
        }
    };

    const handleDeleteUser = (userId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this user?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        if (isConnected == null) {
                            handleDeleteUsers(item.item.id)
                        } else if (isConnected == true) {
                            handleDeleteUsers(item.item.id)
                        } else {
                            handleRemoveUser(userId)
                        }
                    },
                    style: 'destructive',
                },
            ],
        );
    };


    const requestNotificationPermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
      };
      
      const checkNotificationPermission = async () => {
        const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
      };


      const requestPermission = async () => {
        const checkPermission = await checkNotificationPermission();
        if (checkPermission !== RESULTS.GRANTED) {
         const request = await requestNotificationPermission();
           if(request !== RESULTS.GRANTED){
                // permission not granted
            }
        }
        console.log("checkPermission",request)
      };



    const handleDownloadImage = async () => {
        requestPermission()
        const imageUrl = item.item.avatar; // Assuming user.avatar contains the image URL
        const fileName = 'image.jpg'; // File name for the downloaded image

        try {
            // Download the image file
            const downloadOptions = {
                fromUrl: imageUrl,
                toFile: `${RNFS.DocumentDirectoryPath}/${fileName}`,
            };
            const downloadResult = await RNFS.downloadFile(downloadOptions).promise;

            if (downloadResult.statusCode === 200) {
                PushNotification.createChannel(
                    {
                        channelId: 'fcm_fallback_notification_channel',
                        channelName: 'Default channel',
                        channelDescription: 'A Default channel',
                        importance: 4,
                        vibrate: true
                    },
                    // (created) => console.log(`CreatedChannel returned '${notification}'`),
                );
                // Show a notification upon successful download
                PushNotification.localNotification({
                    channelId: 'fcm_fallback_notification_channel',
                    title: 'Download Complete',
                    vibrate: true,
                    message: 'User profile image has been downloaded successfully!',
                });
            } else {
                // Show an error alert if the download fails
                Alert.alert('Error', 'Failed to download user profile image.');
            }
        } catch (error) {
            // Show an error alert if there's an exception
            console.error('Error downloading image:', error);
            Alert.alert('Error', 'An error occurred while downloading user profile image.');
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={{ marginTop: 20, alignItems: 'center', paddingHorizontal: 10 }}>
                <View style={{ width: 200, height: 200, }}>
                    <Card.Cover source={{ uri: item.item.avatar }} />
                </View>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <TextInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <TextInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={{ padding: 5, flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={{ width: 100, height: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    if (isConnected == null) {
                        handleOnlineUpdateUser(item.item.id)
                    } else if (isConnected == true) {
                        handleOnlineUpdateUser(item.item.id)
                    } else {
                        handleUpdateUser(item.item.id)
                    }
                }
                }>
                    <Text style={{ color: 'blue', marginRight: 10 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 100, height: 40, borderWidth: 1, marginLeft: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleDeleteUser(item.item.id)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity style={{ width: '80%', height: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleDownloadImage()}>
                    <Text style={{ color: 'blue' }}>Download Image</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default UserDetailsComponent;