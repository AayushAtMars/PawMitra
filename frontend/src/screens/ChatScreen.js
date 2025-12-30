import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: 'Hello! I am your AI assistant. How can I help you today?',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'PawMitra AI',
            },
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, []);

    const addToHistory = (text, isUser) => {
        const newMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: text,
            createdAt: new Date(),
            user: {
                _id: isUser ? 1 : 2,
                name: isUser ? 'User' : 'PawMitra AI',
            },
        };
        setMessages((previous) => [newMessage, ...previous]);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText.trim();
        setInputText('');
        addToHistory(userMessage, true);
        setLoading(true);

        try {
            // Prepare history for API (reverse chronological order in state, but API needs chronological)
            // Taking last 10 messages for context
            let historyStart = [...messages].reverse().slice(-10).map(msg => ({
                role: msg.user._id === 1 ? 'user' : 'model',
                message: msg.text
            }));

            // Gemini requires history to start with a 'user' role
            // Remove any leading 'model' messages (like the initial greeting)
            while (historyStart.length > 0 && historyStart[0].role === 'model') {
                historyStart.shift();
            }

            const response = await api.post('/chat/text', {
                message: userMessage,
                history: historyStart
            });

            addToHistory(response.data.response, false);
        } catch (error) {
            console.error('Chat error:', error);
            Alert.alert('Error', 'Failed to send message');
            addToHistory('Sorry, I encountered an error. Please try again.', false);
        } finally {
            setLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission needed', 'Audio recording permission is required.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        setLoading(true);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Upload audio for transcription
            const formData = new FormData();
            formData.append('audio', {
                uri: uri,
                type: 'audio/m4a', // adjustments might be needed based on platform/preset
                name: 'audio.m4a',
            });

            // We need to use fetch directly or axios with specific headers for FormData if api instance doesn't handle it
            // Assuming api instance handles it if we pass proper headers or just let axios handle it
            // But typically axios needs 'Content-Type': 'multipart/form-data' which it sets automatically if data is FormData

            const response = await api.post('/chat/audio', formData, {
                transformRequest: (data, headers) => {
                    return data; // prevent axios from stringifying FormData
                },
            });

            const transcription = response.data.text;
            setInputText(transcription);

        } catch (error) {
            console.error('Transcription error:', error);
            Alert.alert('Error', 'Failed to transcribe audio');
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.user._id === 1;
        return (
            <View
                style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.botBubble,
                ]}
            >
                <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id.toString()}
                inverted
                contentContainerStyle={styles.listContent}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        multiline
                    />

                    {inputText.length > 0 ? (
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Icon name="send" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={isRecording ? stopRecording : startRecording}
                            style={[styles.micButton, isRecording && styles.micButtonActive]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Icon name={isRecording ? "stop" : "mic"} size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#333',
    },
    listContent: {
        padding: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#4F46E5',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#FFF',
    },
    botText: {
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 10,
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#4F46E5',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        backgroundColor: '#6B7280',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButtonActive: {
        backgroundColor: '#EF4444',
    },
});

export default ChatScreen;
