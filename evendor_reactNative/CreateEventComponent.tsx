import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import {Picker} from '@react-native-picker/picker';

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Create Event</Text>

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
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
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
            <TouchableOpacity style={styles.button} onPress={applyEvent}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={closeEvent}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  title: {
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

export default CreateEventComponent;
