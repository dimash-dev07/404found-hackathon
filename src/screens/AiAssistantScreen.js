import React, { useState, useCallback, useRef } from 'react';
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
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { APP_CONFIG } from '../config/appConfig';

// ✅ DeepSeek API кілті
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_KEY;

// ✅ Тақырыпқа байланысты AI prompt
const SYSTEM_PROMPT = APP_CONFIG.current.aiPrompt;

// ✅ DeepSeek модельдері
const MODELS = [
    'deepseek-chat',        // ✅ Жылдам, арзан
    'deepseek-reasoner',    // ✅ Ақылды, баяу
];

export default function AiAssistantScreen() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: `Саламатсыз ба! Мен ${APP_CONFIG.current.appName} AI ассистентімін. Сізге қалай көмектесе аламын?`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme, isDark } = useTheme();
    const { orders, getStats } = useOrders();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);

    const callDeepSeek = async (model, history, userInput, dataContext) => {
        if (!DEEPSEEK_API_KEY) {
            throw new Error('DeepSeek API кілті табылмады. .env файлын тексеріңіз.');
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: `${SYSTEM_PROMPT}\n\nПайдаланушының деректері:\n${dataContext}`
                    },
                    ...history,
                    { role: 'user', content: userInput }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data?.error?.message || `HTTP ${response.status}`;
            throw new Error(errorMsg);
        }

        const content = data?.choices?.[0]?.message?.content;
        if (!content || content.trim() === '') {
            throw new Error('Жауап бос қайтты');
        }

        return content;
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMsg = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const currentInput = inputText.trim();
        const history = messages
            .filter(m => m.id !== '1')
            .slice(-6)
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

        // ✅ AI деректер контексті
        const stats = getStats();
        const dataContext = `
Тақырып: ${APP_CONFIG.current.appName}
${APP_CONFIG.current.itemNamePlural}: ${stats.total} дана
Жалпы сома: ₸ ${stats.revenue.toLocaleString()}
Жеткізілді: ${stats.delivered}
Жолда: ${stats.inProgress}
Күтілуде: ${stats.pending}
Орташа сома: ₸ ${stats.avgPrice.toLocaleString()}
Соңғы ${Math.min(5, orders.length)} жазба:
${orders.slice(0, 5).map(o => `- ${o.title} (${o.description}): ₸ ${o.value.toLocaleString()} [${o.status}]`).join('\n')}
        `.trim();

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);
        Keyboard.dismiss();

        let aiResponseText = '';
        let lastError = '';

        // ✅ DeepSeek модельдерін кезекпен байқау
        for (const model of MODELS) {
            try {
                aiResponseText = await callDeepSeek(model, history, currentInput, dataContext);
                console.log(`✅ Сәтті: ${model}`);
                lastError = '';
                break;
            } catch (err) {
                console.warn(`❌ ${model}:`, err.message);
                lastError = err.message;
            }
        }

        if (!aiResponseText) {
            aiResponseText = `🤖 Кешіріңіз, жауап бере алмадым.\n\nСебебі: ${lastError}\n\nКейінірек қайталап көріңіз.`;
        }

        const aiMsg = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    const renderItem = useCallback(({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageBubble,
                isUser
                    ? [styles.userBubble, { backgroundColor: theme.primary }]
                    : [styles.aiBubble, { backgroundColor: isDark ? '#2C2C2E' : '#E9E9EB' }]
            ]}>
                <Text style={[
                    styles.messageText,
                    isUser ? styles.userText : { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
                    {item.text}
                </Text>
                <Text style={[
                    styles.timeText,
                    isUser ? styles.userTime : { color: '#8E8E93' }
                ]}>
                    {item.time}
                </Text>
            </View>
        );
    }, [theme, isDark]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        🤖 {APP_CONFIG.current.appName} AI
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {isLoading ? 'AI ойланып жатыр...' : 'DeepSeek • Онлайн'}
                    </Text>
                </View>

                {/* Хабарламалар */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                />

                {/* Input */}
                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: theme.card,
                        borderTopColor: theme.border,
                        paddingBottom: Math.max(insets.bottom, 12),
                    }
                ]}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                                color: isDark ? '#FFFFFF' : '#000000'
                            }
                        ]}
                        placeholder="Сұрағыңызды жазыңыз..."
                        placeholderTextColor="#8E8E93"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        editable={!isLoading}
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: theme.primary },
                            isLoading && styles.sendButtonDisabled
                        ]}
                        onPress={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.sendButtonText}>➔</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 12, color: '#34C759', marginTop: 2, fontWeight: '500' },
    listContainer: { padding: 16, paddingBottom: 20 },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 18,
        marginBottom: 12
    },
    userBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4
    },
    messageText: { fontSize: 15, lineHeight: 20 },
    userText: { color: '#FFFFFF' },
    timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    userTime: { color: 'rgba(255, 255, 255, 0.7)' },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        minHeight: 40
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    sendButtonDisabled: { opacity: 0.5 },
    sendButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});