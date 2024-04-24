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
        <Text style={styles.title}>Filters</Text>

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
            style={styles.Applybutton}
            title="Apply"
            onPress={applyFilter}>
            <Text style={styles.ApplybuttonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Clearbutton}
            title="Cancel"
            onPress={cancelFilter}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
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
  Clearbutton: {
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
  Applybutton: {
    backgroundColor: '#0000ff',
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
  ApplybuttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FilterComponent;
