import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchController, setFetchController] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (fetchController) fetchController.abort();

    const controller = new AbortController();
    setFetchController(controller);

    try {
      const response = await fetch('http://192.168.1.7:3000/events', {
        signal: controller.signal,
      });
      const data = await response.json();
      setEvents(data.events);
      setLoading(false);
      setError(false);
      console.log('Fetch successful');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setLoading(false);
        setErrorWithLog(error);
      }
    }
  };

  const renderEvents = () => {
    return events.map((event, index) => (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDescription}>Date: {event.date}</Text>
        <Text style={styles.eventDescription}>Venue: {event.venue}</Text>
        <Text style={styles.eventDescription}>Guests: {event.guestNumber}</Text>
        <Text style={styles.eventDescription}>Type: {event.type}</Text>
        <Text style={styles.eventDescription}>Price: {event.price}</Text>
      </View>
    ));
  };

  const refreshPress = () => {
    setLoading(true);
    fetchEvents();
  };

  const setErrorWithLog = message => {
    setErrorMessage(message);
    setError(true);
    console.log('Error message set:', message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Image
        source={require('./Assets/evendorLogo1.png')}
        style={styles.headerImage}
      />
      <View style={styles.mainView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ButtonStyle}>
            <Image
              source={require('./Assets/filtericon.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ButtonStyle} onPress={refreshPress}>
            <Image
              source={require('./Assets/refresh.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}>
          {loading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="#0000ff"
            />
          ) : error ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            renderEvents()
          )}

          <View style={{paddingBottom: 60}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FF56',
  },
  mainView: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderWidth: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  headerImage: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginTop: 40,
  },
  eventContainer: {
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
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 3,
  },
  loader: {
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  ButtonStyle: {
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
    zIndex: 1,
    marginVertical: 5,
  },
  buttonImage: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});

export default App;
