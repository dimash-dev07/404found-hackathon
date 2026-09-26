import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { APP_CONFIG } from '../config/appConfig';

const STATUSES = ['Күтілуде', 'Жолда', 'Жеткізілді'];
const STATUS_COLORS = {
    'Күтілуде': '#FF9500',
    'Жолда': '#007AFF',
    'Жеткізілді': '#34C759',
};

export default function OrdersScreen() {
    const { theme, isDark } = useTheme();
    const { orders, isLoading, addOrder, deleteOrder, updateOrder } = useOrders();
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newValue, setNewValue] = useState('');
    const [newCategory, setNewCategory] = useState('');

    // ✅ Ағымдағы тақырып конфигурациясы
    const config = APP_CONFIG.current;

    const handleAdd = async () => {
        if (!newTitle.trim() || !newDescription.trim() || !newValue.trim()) {
            const msg = 'Барлық өрісті толтырыңыз';
            if (Platform.OS === 'web') {
                window.alert(msg);
            } else {
                Alert.alert('Қате', msg);
            }
            return;
        }

        await addOrder({
            title: newTitle.trim(),
            description: newDescription.trim(),
            value: parseInt(newValue) || 0,
            status: 'Күтілуде',
            category: newCategory.trim() || '—',
        });

        setNewTitle('');
        setNewDescription('');
        setNewValue('');
        setNewCategory('');
        setModalVisible(false);
    };

    const handleDelete = (id, title) => {
        const msg = `"${title}" жазбасын өшіргіңіз келе ме?`;
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(msg);
            if (confirmed) deleteOrder(id);
        } else {
            Alert.alert(
                'Өшіру',
                msg,
                [
                    { text: 'Бас тарту', style: 'cancel' },
                    { text: 'Өшіру', style: 'destructive', onPress: () => deleteOrder(id) },
                ]
            );
        }
    };

    const handleStatusChange = (order) => {
        const currentIndex = STATUSES.indexOf(order.status);
        const nextIndex = (currentIndex + 1) % STATUSES.length;
        updateOrder(order.id, { status: STATUSES[nextIndex] });
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <TouchableOpacity
                    onPress={() => handleStatusChange(item)}
                    style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}
                >
                    <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
                    <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                        {item.status}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: theme.textSecondary }]}>
                📍 {item.description}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={[styles.value, { color: theme.primary }]}>
                    ₸ {item.value.toLocaleString()}
                </Text>
                <Text style={[styles.category, { color: theme.textSecondary }]}>
                    🏷️ {item.category}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.title)}
            >
                <Text style={styles.deleteText}>🗑️ Өшіру</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.headerBar, { backgroundColor: theme.card }]}>
                <Text style={[styles.headerText, { color: theme.text }]}>
                    Барлығы: {orders.length} {config.itemNamePlural.toLowerCase()}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <LinearGradient
                        colors={['#007AFF', '#5856D6']}
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>+ Қосу</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Тізім */}
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={[styles.empty, { color: theme.textSecondary }]}>
                        {config.itemNamePlural} жоқ. «+ Қосу» басыңыз.
                    </Text>
                }
            />

            {/* Modal — жаңа жазба */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            📦 Жаңа {config.itemName.toLowerCase()}
                        </Text>

                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', color: theme.text }]}
                            placeholder={config.itemField}
                            placeholderTextColor="#8E8E93"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', color: theme.text }]}
                            placeholder={config.itemField2}
                            placeholderTextColor="#8E8E93"
                            value={newDescription}
                            onChangeText={setNewDescription}
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', color: theme.text }]}
                            placeholder={config.valueField}
                            placeholderTextColor="#8E8E93"
                            keyboardType="numeric"
                            value={newValue}
                            onChangeText={setNewValue}
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', color: theme.text }]}
                            placeholder={config.categoryField}
                            placeholderTextColor="#8E8E93"
                            value={newCategory}
                            onChangeText={setNewCategory}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#8E8E93' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Бас тарту</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                                onPress={handleAdd}
                            >
                                <Text style={styles.modalButtonText}>Қосу</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerText: { fontSize: 15, fontWeight: '600' },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
    listContainer: { padding: 16 },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: { fontSize: 12, fontWeight: '600' },
    description: { fontSize: 13, marginBottom: 8 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    value: { fontSize: 16, fontWeight: 'bold' },
    category: { fontSize: 12 },
    deleteButton: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        alignItems: 'center',
    },
    deleteText: { color: '#FF3B30', fontSize: 13, fontWeight: '600' },
    empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});