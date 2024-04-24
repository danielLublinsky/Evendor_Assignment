import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

const UserListComponent = ({isVisible, onClose}) => {
  const [users, setUsers] = useState([]);

  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      fetchUsers();
    }
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.1.7:3000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const renderUsers = () => {
    return users.map((user, index) => (
      <View key={index} style={styles.userContainer}>
        <Text>Email: {user.email}</Text>
        <Text>Booked Events: {user.eventCount}</Text>
      </View>
    ));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [700, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.title}>Users</Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewContent}>
        {renderUsers()}

        <View style={{paddingBottom: 60}} />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  scrollView: {
    height: 400,
  },
  userContainer: {
    borderWidth: 2,
    borderColor: '#94FC13',
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 10,
    marginTop: 10,
    width: '90%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#F7FF56',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserListComponent;
