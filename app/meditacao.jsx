import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';

export default function Meditacao() {
  const [gotaSound, setGotaSound] = useState(null);
  const [marSound, setMarSound] = useState(null);

  const [fontsLoaded] = useFonts({
    'ComicSansMS3': require('../assets/fonts/ComicSansMS3.ttf'),
  });

  const [mensagem, setMensagem] = useState('Utilize um fone para melhor experiência!');
  const [contador, setContador] = useState(null);
  const [etapa, setEtapa] = useState(null);
  const [cronometro, setCronometro] = useState(600); // 10 minutos em segundos

  // Mensagens guiadas
  const mensagensGuiadas = [
    'comece encontrando uma posição confortável.',
    'agora relaxe seu corpo fazendo movimentos suaves.',
    'inspire',
    'expire',
    'inspire',
    'expire',
    'inspire',
    'expire',
    'inspire',
    'expire',
    'Concentre-se no som do mar',
  ];

  // Introdução com contagem regressiva
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMensagem('Sua meditação vai começar em...');
    }, 4000);

    const timer2 = setTimeout(() => {
      setMensagem(null);
      setContador(5);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Contador regressivo de 5 até 0
  useEffect(() => {
    if (contador === null) return;

    if (contador > 0) {
      playGota();
      const interval = setTimeout(() => {
        setContador(contador - 1);
      }, 1000);
      return () => clearTimeout(interval);
    }

    if (contador === 0) {
      playMar();
      setEtapa(0); // começa a sequência guiada
    }
  }, [contador]);

  // Sequência de mensagens guiadas
  useEffect(() => {
    if (etapa === null || etapa >= mensagensGuiadas.length) return;

    setMensagem(mensagensGuiadas[etapa]);

    const delay = setTimeout(() => {
      const proximaEtapa = etapa + 1;
      if (proximaEtapa < mensagensGuiadas.length) {
        setEtapa(proximaEtapa);
      } else {
        setEtapa(null);
        setMensagem(null);
        iniciarCronometro();
      }
    }, 6000); // 6 segundos por mensagem

    return () => clearTimeout(delay);
  }, [etapa]);

  // Cronômetro de 10 minutos
  function iniciarCronometro() {
    const interval = setInterval(() => {
      setCronometro(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  // Sons
  async function playGota() {
    try {
      if (!gotaSound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/gota-contagem.mp3')
        );
        setGotaSound(sound);
        await sound.replayAsync();
      } else {
        await gotaSound.replayAsync();
      }
    } catch (error) {
      console.log('Erro na gota:', error);
    }
  }

  async function playMar() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/mar.mp3'),
        { isLooping: true }
      );
      setMarSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Erro no mar:', error);
    }
  }

  // Parar o som quando sair da tela
  useEffect(() => {
    return () => {
      if (gotaSound) gotaSound.unloadAsync();
      if (marSound) marSound.unloadAsync();
    };
  }, [gotaSound, marSound]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {mensagem && <Text style={styles.text}>{mensagem}</Text>}
      {contador !== null && contador > 0 && etapa === null && (
        <Text style={styles.countdown}>{contador}</Text>
      )}
      {etapa === null && cronometro < 600 && (
        <Text style={styles.timer}>{formatarTempo(cronometro)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 36,
    fontFamily: 'ComicSansMS3',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 48,
  },
  countdown: {
    fontSize: 128,
    fontFamily: 'ComicSansMS3',
    color: '#3E9FFF',
  },
  timer: {
    fontSize: 128,
    fontFamily: 'ComicSansMS3',
    color: '#3E9FFF',
  },
});
