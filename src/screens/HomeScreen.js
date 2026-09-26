import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { APP_CONFIG } from '../config/appConfig';

export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();

    // ✅ Тақырыпқа байланысты мәзір
    const menuItems = [
        { title: APP_CONFIG.current.itemNamePlural, screen: 'Orders', icon: '📦' },
        { title: 'AI Көмекші', screen: 'AiAssistant', icon: '🤖' },
        { title: 'Аналитика', screen: 'Analytics', icon: '📊' },
        { title: 'Профиль', screen: 'Profile', icon: '👤' },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Логотип + Тақырып */}
            <View style={styles.headerSection}>
                <LinearGradient
                    colors={['#007AFF', '#5856D6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoContainer}
                >
                    <Text style={styles.logoText}>404</Text>
                </LinearGradient>

                <Text style={[styles.title, { color: theme.text }]}>
                    {APP_CONFIG.current.appName}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {APP_CONFIG.current.appDescription}
                </Text>
            </View>

            {/* Мәзір батырмалары */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(item.screen)}
                        activeOpacity={0.8}
                        style={styles.buttonWrapper}
                    >
                        <LinearGradient
                            colors={['#007AFF', '#0062CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonIcon}>{item.icon}</Text>
                            <Text style={styles.buttonText}>{item.title}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Қосымша ақпарат */}
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>
                    💡 {APP_CONFIG.current.appName} жайлы
                </Text>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Бұл — {APP_CONFIG.current.appDescription.toLowerCase()}.
                    Қосымша AI көмекші, аналитика және профиль экрандарын қамтиды.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
        justifyContent: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    logoText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    menuContainer: {
        marginBottom: 30,
    },
    buttonWrapper: {
        marginBottom: 12,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 14,
    },
    buttonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoCard: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
});