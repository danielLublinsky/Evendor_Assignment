import React, {useState, useEffect, useRef} from 'react';
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
import BookEventComponent from './BookEventComponent';
import CreateEventComponent from './CreateEventComponent';
import FilterComponent from './FilterComponent';
import VenueSearchComponent from './VenueSearchComponent';
import UserListComponent from './userListComponent';

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchController, setFetchController] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isBookEventVisible, setIsBookEventVisible] = useState(false);
  const [bookingEventId, setbookingEventId] = useState('');
  const [isVenueSearchVisible, setIsVenueSearchVisible] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    date: '',
    name: '',
    type: '',
  });

  const fetchEvents = async () => {
    if (fetchController) fetchController.abort();

    const controller = new AbortController();
    setFetchController(controller);

    try {
      const queryParams = new URLSearchParams(filterData);
      const url = `${SERVER_ADDRESS}/events?${queryParams}`;
      const response = await fetch(url, {
        signal: controller.signal,
      });
      const data = await response.json();
      if (data.error == null) {
        setEvents(data.events);
        setError(false);
      } else showError(data.error);
      setLoading(false);

      console.log('Fetch successful');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
        setLoading(false);
        showError(error);
      }
    }
  };

  const renderEvents = () => {
    if (events.length === 0) {
      showError('No events found ):');
    }

    return events.map((event, index) => (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDescription}>Date: {event.date}</Text>
        <Text style={styles.eventDescription}>Venue: {event.venue}</Text>
        <Text style={styles.eventDescription}>Guests: {event.guestNumber}</Text>
        <Text style={styles.eventDescription}>Type: {event.type}</Text>
        <Text style={styles.eventDescription}>Price: {event.price}</Text>

        <TouchableOpacity
          style={styles.ButtonStyle}
          onPress={() => toggleBookEvent(event.id)}>
          <Text style={styles.eventTitle}>Book Event!</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const closeComponents = () => {
    closeBookEvent();
    closeCreateEvent();
    closeFilter();
    closeVenues();
    closeUserList();
  };

  const showError = error => {
    setError(true);
    setErrorMessage(error);
    console.log('Error occurred:', error);
  };
  const refreshPress = () => {
    closeComponents();
    setLoading(true);
    fetchEvents();
  };

  const toggleFilter = () => {
    closeComponents();
    setIsFilterVisible(prev => !prev);
  };

  const toggleCreateEvent = () => {
    closeComponents();
    setIsCreateEventVisible(prev => !prev);
  };

  const closeFilter = () => {
    setIsFilterVisible(false);
  };

  const closeCreateEvent = () => {
    setIsCreateEventVisible(false);
  };

  const toggleBookEvent = eventId => {
    closeComponents();
    setbookingEventId(eventId);
    setIsBookEventVisible(true);
  };
  const closeBookEvent = () => {
    setIsBookEventVisible(false);
  };

  const toggleVenues = () => {
    closeComponents();
    setIsVenueSearchVisible(prev => !prev);
  };

  const closeVenues = () => {
    setIsVenueSearchVisible(false);
  };

  const toggleUserList = () => {
    setIsUserListVisible(prev => !prev);
  };

  const closeUserList = () => {
    setIsUserListVisible(false);
  };

  const bookEvent = async email => {
    try {
      const response = await fetch(
        `${SERVER_ADDRESS}/book-event/${bookingEventId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      closeBookEvent();
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilter = (newDate, newName, newType) => {
    setFilterData({
      date: newDate,
      name: newName,
      type: newType,
    });
  };

  const applyEvent = async (
    eventName,
    eventVenue,
    eventGuestNumber,
    eventPrice,
    eventType,
    eventDate,
  ) => {
    try {
      const response = await fetch(`${SERVER_ADDRESS}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: eventName,
          venue: eventVenue,
          guestNumber: eventGuestNumber,
          price: eventPrice,
          type: eventType,
          date: eventDate,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      closeCreateEvent();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(filterData);
    fetchEvents();
  }, [filterData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.TopbuttonContainer}>
        <TouchableOpacity style={styles.ButtonStyle} onPress={toggleVenues}>
          <Image
            source={require('./Assets/eventIcon.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ButtonStyle} onPress={toggleUserList}>
          <Image
            source={require('./Assets/userIcon.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={require('./Assets/evendorLogo1.png')}
        style={styles.headerImage}
      />

      <View style={styles.mainView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ButtonStyle} onPress={toggleFilter}>
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
          <TouchableOpacity
            style={styles.ButtonStyle}
            onPress={toggleCreateEvent}>
            <Image
              source={require('./Assets/PlusIcon.png')}
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
      <FilterComponent
        isVisible={isFilterVisible}
        onClose={closeFilter}
        onApply={applyFilter}
      />
      <CreateEventComponent
        isVisible={isCreateEventVisible}
        onClose={closeCreateEvent}
        onApply={applyEvent}
      />
      <BookEventComponent
        isVisible={isBookEventVisible}
        onClose={closeBookEvent}
        onBook={bookEvent}
      />
      <VenueSearchComponent
        isVisible={isVenueSearchVisible}
        onClose={closeVenues}
        setEvents={setEvents}
      />
      <UserListComponent
        isVisible={isUserListVisible}
        onClose={closeUserList}
      />
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
  errorText: {
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#FC131F',
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 10,
    marginTop: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  buttonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },

  TopbuttonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    left: 10,
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

    marginVertical: 5,
  },
  buttonImage: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});

export default App;
export const SERVER_ADDRESS = 'http://192.168.1.7:3000';
