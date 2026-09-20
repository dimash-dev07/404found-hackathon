import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Басты бет 🚀</Text>
            <Text style={styles.subtitle}>404 Found - Hackathon MVP</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AiAssistant')}>
                <Text style={styles.buttonText}>AI Көмекшіге өту</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Analytics')}>
                <Text style={styles.buttonText}>Аналитикаға өту</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.buttonText}>Профильге өту</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#111' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
    button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginVertical: 8, width: '80%', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});