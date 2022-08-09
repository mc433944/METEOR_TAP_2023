import React, {useState} from "react";
import { View, StyleSheet, TextInput, Button} from "react-native";


const InputBox = (props) => {
  const { title, updateDateMode } = props;
  // const [password, setPassword,] = useState('');
  // const changeText = (text) => {
  //   setPassword(text);
  // }
  return (
    <View style={styles.inputContainerPassword}>
        <Button title={title} onPress={() => updateDateMode()} />
        {/* <TextInput value={password} onChangeText={(text) => changeText(text)} style={styles.inputStyle} placeholder="date" autoCapitalize="none" autoCorrect={false} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  inputContainerPassword: {
    marginVertical: 10,
    marginHorizontal: 10,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    flexDirection: "row",
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    height: 50,
    width: 150,
    backgroundColor: '#CCCCCC',
  },
})

export default InputBox;