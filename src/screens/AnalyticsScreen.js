import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { APP_CONFIG } from '../config/appConfig';

const { width } = Dimensions.get('window');

// 🎬 Анимацияланған карточка
const AnimatedStatCard = ({ item, index, theme, isDark }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, [item.value]);

    return (
        <Animated.View
            style={[
                styles.statCardWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <LinearGradient
                colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#FFFFFF', '#F8F9FA']}
                style={styles.statCard}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <LinearGradient
                        colors={item.isUp ? ['#34C759', '#2E7D32'] : ['#FF3B30', '#C62828']}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>{item.change}</Text>
                    </LinearGradient>
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{item.value}</Text>
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{item.title}</Text>
            </LinearGradient>
        </Animated.View>
    );
};

// 🎬 Анимацияланған бағана
const AnimatedBar = ({ bar, index, isSelected, onPress, trigger }) => {
    const heightAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        heightAnim.setValue(0);
        Animated.timing(heightAnim, {
            toValue: bar.height,
            duration: 600,
            delay: index * 60,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [bar.height, trigger]);

    useEffect(() => {
        if (isSelected) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isSelected]);

    return (
        <TouchableOpacity
            style={styles.barWrapper}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <View style={styles.barBackground}>
                    <Animated.View style={{ height: heightAnim, width: '100%' }}>
                        <LinearGradient
                            colors={isSelected ? ['#34C759', '#2E7D32'] : ['#007AFF', '#5AC8FA']}
                            style={styles.barFill}
                        />
                    </Animated.View>
                </View>
            </Animated.View>
            <Text style={[styles.barLabel, isSelected && styles.barLabelSelected]}>
                {bar.day}
            </Text>
        </TouchableOpacity>
    );
};

export default function AnalyticsScreen() {
    const [selectedFilter, setSelectedFilter] = useState('Апта');
    const [activeBar, setActiveBar] = useState(null);
    const [animationTrigger, setAnimationTrigger] = useState(0);
    const { theme, isDark } = useTheme();
    const { orders, getStats } = useOrders();

    const stats = getStats();
    const config = APP_CONFIG.current;

    // 📊 Нақты статистика — тақырыпқа байланысты
    const statsCards = useMemo(() => [
        {
            id: '1',
            title: `Жалпы ${config.itemName.toLowerCase()}`,   // ✅ «Жалпы жүк»
            value: stats.total.toString(),
            change: `+${stats.total}`,
            isUp: true,
            icon: '📦',
        },
        {
            id: '2',
            title: config.valueLabel,                           // ✅ ДИНАМИКАЛЫҚ
            value: `${stats.revenue.toLocaleString()} ${config.valueUnit}`,
            change: `+${stats.revenue > 0 ? Math.round(stats.revenue / 1000) : 0}K`,
            isUp: true,
            icon: '💰',
        },
        {
            id: '3',
            title: 'Жеткізілді',
            value: stats.delivered.toString(),
            change: stats.total > 0 ? `+${Math.round((stats.delivered / stats.total) * 100)}%` : '+0%',
            isUp: true,
            icon: '✅',
        },
        {
            id: '4',
            title: 'Жолда',
            value: stats.inProgress.toString(),
            change: stats.total > 0 ? `+${Math.round((stats.inProgress / stats.total) * 100)}%` : '+0%',
            isUp: true,
            icon: '🚚',
        },
    ], [stats, config]);

    // 📈 График деректері — фильтрге байланысты
    const chartData = useMemo(() => {
        const now = new Date();

        if (selectedFilter === 'Күн') {
            const hours = [];
            for (let i = 5; i >= 0; i--) {
                const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
                const hourStr = hour.getHours().toString().padStart(2, '0') + ':00';
                const count = orders.filter(o => {
                    const orderDate = new Date(o.date);
                    return orderDate.getHours() === hour.getHours() &&
                        orderDate.toDateString() === hour.toDateString();
                }).length;
                hours.push({
                    day: hourStr,
                    value: count,
                    height: Math.min(count * 30 + 40, 190),
                });
            }
            return hours;
        }

        if (selectedFilter === 'Апта') {
            const days = [];
            const dayNames = ['Жек', 'Дүй', 'Сей', 'Сәр', 'Бей', 'Жұм', 'Сен'];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const count = orders.filter(o => {
                    const orderDate = new Date(o.date);
                    return orderDate.toDateString() === date.toDateString();
                }).length;
                days.push({
                    day: dayNames[date.getDay()],
                    value: count,
                    height: Math.min(count * 30 + 40, 190),
                });
            }
            return days;
        }

        if (selectedFilter === 'Ай') {
            const weeks = [];
            for (let i = 3; i >= 0; i--) {
                const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
                const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
                const count = orders.filter(o => {
                    const orderDate = new Date(o.date);
                    return orderDate >= weekStart && orderDate < weekEnd;
                }).length;
                weeks.push({
                    day: `${4 - i} Апта`,
                    value: count,
                    height: Math.min(count * 20 + 40, 190),
                });
            }
            return weeks;
        }

        const quarters = [];
        for (let i = 3; i >= 0; i--) {
            const qStart = new Date(now.getFullYear(), (3 - i) * 3, 1);
            const qEnd = new Date(now.getFullYear(), (4 - i) * 3, 1);
            const count = orders.filter(o => {
                const orderDate = new Date(o.date);
                return orderDate >= qStart && orderDate < qEnd;
            }).length;
            quarters.push({
                day: `${4 - i} Тоқс`,
                value: count,
                height: Math.min(count * 20 + 40, 190),
            });
        }
        return quarters;
    }, [orders, selectedFilter]);

    // 📊 Статус статистикасы
    const statusStats = useMemo(() => {
        const delivered = orders.filter(o => o.status === 'Жеткізілді').length;
        const inProgress = orders.filter(o => o.status === 'Жолда').length;
        const pending = orders.filter(o => o.status === 'Күтілуде').length;

        return { delivered, inProgress, pending };
    }, [orders]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setActiveBar(null);
        setAnimationTrigger(prev => prev + 1);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* Фильтрлер */}
                <View style={[styles.filterContainer, { backgroundColor: isDark ? '#2C2C2E' : '#E9E9EB' }]}>
                    {['Күн', 'Апта', 'Ай', 'Жыл'].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterButton,
                                selectedFilter === filter && [
                                    styles.filterButtonActive,
                                    { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
                                ],
                            ]}
                            onPress={() => handleFilterChange(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextActive,
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Статистика карточкалары */}
                <View style={styles.statsGrid}>
                    {statsCards.map((item, index) => (
                        <AnimatedStatCard
                            key={item.id}
                            item={item}
                            index={index}
                            theme={theme}
                            isDark={isDark}
                        />
                    ))}
                </View>

                {/* График */}
                <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.chartTitle, { color: theme.text }]}>
                        Белсенділік динамикасы
                    </Text>
                    <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
                        {selectedFilter} бойынша көрсеткіштер
                        {activeBar !== null &&
                            ` (${chartData[activeBar].day}: ${chartData[activeBar].value} ${config.itemName.toLowerCase()})`}
                    </Text>

                    <View style={styles.chartContainer}>
                        {chartData.map((bar, index) => (
                            <AnimatedBar
                                key={index}
                                bar={bar}
                                index={index}
                                isSelected={activeBar === index}
                                onPress={() => setActiveBar(index)}
                                trigger={animationTrigger}
                            />
                        ))}
                    </View>
                </View>

                {/* Жүйелік статус */}
                <View style={[styles.reportCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.reportTitle, { color: theme.text }]}>
                        ⚡ Жүйелік статус
                    </Text>
                    <View style={[styles.reportRow, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.reportLabel, { color: theme.textSecondary }]}>
                            Жеткізілді:
                        </Text>
                        <Text style={[styles.reportValue, { color: '#34C759' }]}>
                            {statusStats.delivered} {config.itemName.toLowerCase()}
                        </Text>
                    </View>
                    <View style={[styles.reportRow, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.reportLabel, { color: theme.textSecondary }]}>
                            Жолда:
                        </Text>
                        <Text style={[styles.reportValue, { color: '#007AFF' }]}>
                            {statusStats.inProgress} {config.itemName.toLowerCase()}
                        </Text>
                    </View>
                    <View style={[styles.reportRow, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.reportLabel, { color: theme.textSecondary }]}>
                            Күтілуде:
                        </Text>
                        <Text style={[styles.reportValue, { color: '#FF9500' }]}>
                            {statusStats.pending} {config.itemName.toLowerCase()}
                        </Text>
                    </View>
                    <View style={[styles.reportRow, { borderBottomColor: theme.border, borderBottomWidth: 0 }]}>
                        <Text style={[styles.reportLabel, { color: theme.textSecondary }]}>
                            Орташа мән:
                        </Text>
                        <Text style={[styles.reportValue, { color: theme.text }]}>
                            {stats.avgPrice.toLocaleString()} {config.valueUnit}
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { padding: 16, paddingBottom: 30 },

    filterContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    filterButtonActive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    filterText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
    filterTextActive: { color: '#007AFF' },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCardWrapper: { width: (width - 44) / 2, marginBottom: 12 },
    statCard: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardIcon: { fontSize: 22 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statTitle: { fontSize: 12, marginTop: 4 },

    chartCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chartTitle: { fontSize: 16, fontWeight: 'bold' },
    chartSubtitle: { fontSize: 12, marginTop: 2, marginBottom: 20 },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 210,
        paddingTop: 10,
    },
    barWrapper: { alignItems: 'center' },
    barBackground: {
        width: 18,
        height: 180,
        backgroundColor: '#F2F2F7',
        borderRadius: 9,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: { width: '100%', flex: 1, borderRadius: 9 },
    barLabel: { fontSize: 11, color: '#8E8E93', marginTop: 8, fontWeight: '500' },
    barLabelSelected: { color: '#34C759', fontWeight: 'bold' },

    reportCard: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    reportTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
    },
    reportLabel: { fontSize: 13 },
    reportValue: { fontSize: 13, fontWeight: '600' },
});