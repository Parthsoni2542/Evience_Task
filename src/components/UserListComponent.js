
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import { useSelector } from 'react-redux';
const UserListComponent = () => {
    const navigation = useNavigation();
    const userData = useSelector((state) => state)
    console.log("user", userData)



    const renderItem = ({ item }) => (

        <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 10 }} onPress={()=>{
            navigation.navigate("UserDetails",{
                "item":item
            })
        }}>
            <Card style={{ padding: 5, flexDirection: 'row' }}>
                <Card.Content style={{ flexDirection: 'row' }}>
                    <Card.Cover source={{ uri: item.avatar }} style={{ width: 80, height: 80 }} />
                    <View style={{ marginLeft: 10 }}>
                        <Text variant="bodyMedium">First name :{item.first_name}</Text>
                        <Text variant="bodyMedium">Last name :{item.last_name}</Text>
                        <Text variant="bodyMedium">Email :{item.email}</Text>
                    </View>

                </Card.Content>

            </Card>
        </TouchableOpacity>
    );

    if (userData.loading) {
        return <Text>Loading...</Text>;
    }

   
    return (

        <FlatList
            data={userData.users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
}


export default UserListComponent;