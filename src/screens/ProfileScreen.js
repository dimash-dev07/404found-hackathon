import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    Alert,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// 🎬 Анимацияланған секция
const AnimatedSection = ({ children, delay = 0 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}
        >
            {children}
        </Animated.View>
    );
};

export default function ProfileScreen() {
    const [notifications, setNotifications] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [userRole, setUserRole] = useState('Lead Developer');
    const { theme, isDark, setIsDark } = useTheme();

    const avatarScale = useRef(new Animated.Value(1)).current;

    const handleAvatarPress = () => {
        Animated.sequence([
            Animated.timing(avatarScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(avatarScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();

        setUserRole(prev => prev === 'Lead Developer' ? 'Administrator' : 'Lead Developer');
    };

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Жүйеден шыққыңыз келетініне сенімдісіз бе?');
            if (confirmed) alert('Жүйеден сәтті шықтыңыз!');
        } else {
            Alert.alert(
                'Жүйеден шығу',
                'Профильден шыққыңыз келетініне сенімдісіз бе?',
                [
                    { text: 'Бас тарту', style: 'cancel' },
                    { text: 'Шығу', style: 'destructive', onPress: () => alert('Шықтыңыз!') }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Profile Card */}
                <AnimatedSection delay={0}>
                    <LinearGradient
                        colors={['#007AFF', '#5856D6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileCard}
                    >
                        <TouchableOpacity
                            onPress={handleAvatarPress}
                            activeOpacity={0.9}
                            style={styles.avatarWrapper}
                        >
                            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
                                <LinearGradient
                                    colors={['#FFFFFF', '#E5E5EA']}
                                    style={styles.avatarContainer}
                                >
                                    <Text style={styles.avatarText}>404</Text>
                                </LinearGradient>
                            </Animated.View>
                        </TouchableOpacity>

                        <Text style={styles.userName}>Сейтжан Дінмұхаммед</Text>
                        <Text style={styles.userRole}>{userRole} • 404 Found Team</Text>

                        <TouchableOpacity
                            onPress={handleAvatarPress}
                            style={styles.badgeContainer}
                            activeOpacity={0.7}
                        >
                            <View style={styles.statusDot} />
                            <Text style={styles.statusBadge}>Активті сессия</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </AnimatedSection>

                {/* Баптаулар */}
                <AnimatedSection delay={100}>
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            ⚙️ Жүйелік баптаулар
                        </Text>

                        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingIcon}>🔔</Text>
                                <Text style={[styles.settingLabel, { color: theme.text }]}>
                                    Хабарландырулар
                                </Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                            />
                        </View>

                        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingIcon}>🌙</Text>
                                <Text style={[styles.settingLabel, { color: theme.text }]}>
                                    Қараңғы тема
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={setIsDark}
                                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                            />
                        </View>

                        <View style={[styles.settingRow, styles.settingRowLast, { borderBottomColor: theme.border }]}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingIcon}>🔄</Text>
                                <Text style={[styles.settingLabel, { color: theme.text }]}>
                                    Авто-жаңарту
                                </Text>
                            </View>
                            <Switch
                                value={autoUpdate}
                                onValueChange={setAutoUpdate}
                                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                            />
                        </View>
                    </View>
                </AnimatedSection>

                {/* Жоба туралы */}
                <AnimatedSection delay={200}>
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            ℹ️ Жоба туралы
                        </Text>

                        <TouchableOpacity
                            style={[styles.infoRow, { borderBottomColor: theme.border }]}
                            onPress={() => alert('404 Found - Логистика мен бағдарларды оңтайландыру жүйесі')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                Жоба атауы
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.infoValue }]}>
                                404 Found App ↗
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.infoRow, { borderBottomColor: theme.border }]}
                            onPress={() => alert('Қазіргі нұсқасы: 1.0.0 (Hackathon Edition)')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                Нұсқасы
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.infoValue }]}>
                                v1.0.0 ↗
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.infoRow, styles.infoRowLast, { borderBottomColor: theme.border }]}
                            onPress={() => alert('Бекенд OpenRouter AI & Node.js негізінде жасалған')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                Сервер бекенді
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.infoValue }]}>
                                Node.js / OpenRouter ↗
                            </Text>
                        </TouchableOpacity>
                    </View>
                </AnimatedSection>

                {/* Шығу батырмасы */}
                <AnimatedSection delay={300}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        style={styles.logoutWrapper}
                    >
                        <LinearGradient
                            colors={['#FF3B30', '#C62828']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.logoutButton}
                        >
                            <Text style={styles.logoutButtonText}>Жүйеден шығу</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </AnimatedSection>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: 16, paddingBottom: 30 },

    profileCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 8,
    },
    avatarWrapper: { marginBottom: 12 },
    avatarContainer: {
        width: 84,
        height: 84,
        borderRadius: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userRole: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34C759',
        marginRight: 6,
    },
    statusBadge: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    section: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingRowLast: { borderBottomWidth: 0 },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    settingLabel: {
        fontSize: 15,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    infoRowLast: { borderBottomWidth: 0 },
    infoLabel: { fontSize: 14 },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },

    logoutWrapper: {
        marginTop: 10,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    logoutButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});