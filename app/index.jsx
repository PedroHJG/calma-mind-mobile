import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function Index() {
  
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'ComicSansMS3': require('../assets/fonts/ComicSansMS3.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/app-images/logo.png')}
        style={{ width: 300, height: 147, marginBottom: 74 }}
      />

      <Text style={styles.title}>Escolha uma das opções:</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/meditacao')}>
        <Text style={styles.btnText}>MindFulness</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/terapia')}>
        <Text style={styles.btnText}>Terapia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Relaxar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "black",
    fontSize: 24,
    fontFamily: 'ComicSansMS3',
  },
  btn: {
    backgroundColor: "#3E9FFF",
    borderRadius: 15,
    paddingHorizontal: 34,
    paddingVertical: 16,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 24,
    fontFamily: 'ComicSansMS3',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
