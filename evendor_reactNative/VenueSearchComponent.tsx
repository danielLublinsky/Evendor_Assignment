import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
const VenueSearchComponent = ({isVisible, onClose, setEvents}) => {
  const [guestNumber, setGuestNumber] = useState('');
  const [dateShown, setDateShown] = useState(dayjs().format('YYYY-MM-DD'));
  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      date: dateShown,
      guestNumber: guestNumber,
    });
    const url = `http://192.168.1.7:3000/venues?${queryParams}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      console.log(data.venues);
      setEvents(data.venues);
      onClose();
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Handle error accordingly
    }
  };

  const handleClose = () => {
    setGuestNumber('');
    setDateShown(dayjs().format('YYYY-MM-DD'));
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Venues</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TextInput
          style={styles.input}
          placeholder="Enter guest number"
          onChangeText={setGuestNumber}
          value={guestNumber}
        />
        <DateTimePicker
          mode="single"
          date={dateShown}
          onChange={params =>
            setDateShown(dayjs(params.date).format('YYYY-MM-DD'))
          }
        />
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.SearchbuttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.CancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    backgroundColor: '#0000ff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  cancelButton: {
    backgroundColor: '#F7FF56',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  CancelButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  SearchbuttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default VenueSearchComponent;
