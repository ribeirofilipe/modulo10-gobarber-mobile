import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Container, HourList, Hour, Title } from './styles';

import Background from '~/components/Background';
import DateInput from '~/components/DateInput';

import api from '~/services/api';

export default function SelectDateTime({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);

  const provider = navigation.getParam('provider');

  async function loadAvailable() {

    const response = await api.get(`providers/${provider.id}/available`, {
      params: {
        date: date.getTime(),
      }
    });

    setHours(response.data);
  }

  function handleSelectHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time
    });
  }

  useEffect(() => {
    loadAvailable();
  }, [date, provider.id])

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate} />

        <HourList
          data={hours}
          keyExtractor={item => item.time}
          renderItem={({ item }) => (
            <Hour onPress={() => handleSelectHour(item.value)} enable={item.available}>
              <Title>{item.time}</Title>
            </Hour>
          )}
        />
      </Container>
    </Background>
  );
}

SelectDateTime.navigationOptions = ({ navigation }) => ({
  title: 'Selecione o horário',
  headerTitleStyle: {
    marginLeft: 60,
  },
  headerLeft: () => (
    <TouchableOpacity onPress={() => { navigation.navigate('SelectProvider')}}>
      <Icon
        name="chevron-left"
        size={20}
        color="#FFF"
      />
    </TouchableOpacity>
  )
});
