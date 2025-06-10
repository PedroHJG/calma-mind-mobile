import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const ip = 'SEU IP AQUI';

export default function Terapia() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá, sou sua terapeuta virtual. Como você está se sentindo hoje?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    simulateTherapistResponse(input);
  };

const simulateTherapistResponse = async (userMessage) => {
  setIsTyping(true);

  const botReply = await generateTherapistReply(userMessage); // resposta da API
  const newBotMessage = { id: Date.now().toString(), text: botReply, sender: 'bot' };

  setMessages(prev => [...prev, newBotMessage]);
  setIsTyping(false);
};


const generateTherapistReply = async (userMessage) => {
  try {
    const response = await fetch(`http://${ip}:3001/terapia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: userMessage }),
    });

    const data = await response.json();
    return data.resposta || 'Desculpe, algo deu errado.';
  } catch (err) {
    console.error(err);
    return 'Erro ao se conectar com a terapeuta.';
  }
};


  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      {isTyping && <Text style={styles.typingText}>Terapeuta está digitando...</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 16 },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E2E2E2',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#3E9FFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  typingText: {
    marginLeft: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#555',
  },
});