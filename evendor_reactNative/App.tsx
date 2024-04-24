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
  TextInput,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import {Picker} from '@react-native-picker/picker';

const FilterComponent = ({isVisible, onClose, onApply}) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [dateShown, setDateShown] = useState(dayjs().format('YYYY-MM-DD'));
  const [date, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const applyFilter = () => {
    onApply(date, eventName, eventType);
    onClose();
  };

  const cancelFilter = () => {
    onApply('', '', '');
    closeFilter();
  };

  const closeFilter = () => {
    setDateShown(dayjs().format('YYYY-MM-DD'));
    setEventName('');
    setEventType('');
    setDate('');
    onClose();
  };

  useEffect(() => {
    setDate(dateShown);
  }, [dateShown]);

  return (
    <Animated.View
      style={[
        styles.filterContainer,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.filterText}>Filters</Text>

        <TextInput
          style={styles.input}
          onChangeText={setEventName}
          value={eventName}
          placeholder="Event Name"
        />
        <DateTimePicker
          mode="single"
          date={dateShown}
          onChange={params =>
            setDateShown(dayjs(params.date).format('YYYY-MM-DD'))
          }
        />
        <Picker
          selectedValue={eventType}
          onValueChange={itemValue => setEventType(itemValue)}
          style={styles.input}>
          <Picker.Item label="Select Event Type" value="" />
          <Picker.Item label="BirthDay" value="BirthDay" />
          <Picker.Item label="Wedding" value="Wedding" />
        </Picker>
        <View>
          <TouchableOpacity
            style={styles.ButtonStyle}
            title="Apply"
            onPress={applyFilter}>
            <Text style={styles.filterText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ButtonStyle}
            title="Cancel"
            onPress={cancelFilter}>
            <Text style={styles.filterText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
const CreateEventComponent = ({isVisible, onClose, onApply}) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [eventName, setEventName] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventGuestNumber, setEventGuestNumber] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventType, setEventType] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [eventDate, setEventDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const applyEvent = () => {
    onApply(
      eventName,
      eventVenue,
      eventGuestNumber,
      eventPrice,
      eventType,
      eventDate,
    );
    closeEvent();
  };

  const closeEvent = () => {
    setEventName('');
    setEventVenue('');
    setEventGuestNumber('');
    setEventPrice('');
    setEventType('');
    setEventDate(dayjs().format('YYYY-MM-DD'));
    setShowDateTimePicker(false);
    onClose();
  };

  const handleNext = () => {
    setShowDateTimePicker(true);
  };

  return (
    <Animated.View
      style={[
        styles.filterContainer,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.filterText}>Create Event</Text>

        {!showDateTimePicker && (
          <>
            <TextInput
              style={styles.input}
              onChangeText={setEventName}
              value={eventName}
              placeholder="Event Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setEventVenue}
              value={eventVenue}
              placeholder="Event Venue"
            />
            <Picker
              selectedValue={eventType}
              onValueChange={setEventType}
              style={styles.input}>
              <Picker.Item label="Select Event Type" value="" />
              <Picker.Item label="BirthDay" value="BirthDay" />
              <Picker.Item label="Wedding" value="Wedding" />
            </Picker>
            <TextInput
              style={styles.input}
              onChangeText={setEventGuestNumber}
              keyboardType="numeric"
              value={eventGuestNumber}
              placeholder="Event Guest Number"
            />
            <TextInput
              style={styles.input}
              onChangeText={setEventPrice}
              keyboardType="numeric"
              value={eventPrice}
              placeholder="Event Price"
            />
            <TouchableOpacity
              style={styles.ButtonStyle}
              title="Next"
              onPress={handleNext}>
              <Text style={styles.filterText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {showDateTimePicker && (
          <>
            <DateTimePicker
              mode="single"
              date={eventDate}
              onChange={params =>
                setEventDate(dayjs(params.date).format('YYYY-MM-DD'))
              }
            />
            <TouchableOpacity
              style={styles.ButtonStyle}
              title="Apply"
              onPress={applyEvent}>
              <Text style={styles.filterText}>Apply</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.ButtonStyle}
          title="Cancel"
          onPress={closeEvent}>
          <Text style={styles.filterText}>Cancel</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchController, setFetchController] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    date: '',
    name: '',
    type: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (fetchController) fetchController.abort();

    const controller = new AbortController();
    setFetchController(controller);

    try {
      const queryParams = new URLSearchParams(filterData);
      const url = `http://192.168.1.7:3000/events?${queryParams}`;

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
        console.error('Error fetching events:', error);
        setLoading(false);
        showError(error);
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

  const showError = error => {
    setError(true);
    setErrorMessage(error);
    console.log('Error occurred:', error);
  };
  const refreshPress = () => {
    setLoading(true);
    fetchEvents();
  };

  const toggleFilter = () => {
    setIsFilterVisible(prev => !prev);
  };

  const toggleCreateEvent = () => {
    setIsCreateEventVisible(prev => !prev);
  };

  const closeFilter = () => {
    setIsFilterVisible(false);
  };

  const closeCreateEvent = () => {
    setIsFilterVisible(false);
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
      const response = await fetch('http://192.168.1.7:3000/events', {
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

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      console.log('New event created:', data.event);
      closeCreateEvent();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    console.log(filterData);
    fetchEvents();
  }, [filterData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        onClose={toggleCreateEvent}
        onApply={applyEvent}
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
  filterContainer: {
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

  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
