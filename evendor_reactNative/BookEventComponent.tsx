import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const BookEventComponent = ({isVisible, onClose, onBook}) => {
  const [email, setEmail] = useState('');

  const handleBook = () => {
    onBook(email);
    setEmail('');
    onClose();
  };

  const handleCancel = () => {
    setEmail('');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
        value={email}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.BookbuttonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.CancelbuttonText}>Cancel</Text>
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
  bookButton: {
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
  CancelbuttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  BookbuttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default BookEventComponent;
