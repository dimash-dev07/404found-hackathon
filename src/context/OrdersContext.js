import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { APP_CONFIG } from '../config/appConfig';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasSeeded = useRef(false);

    const config = APP_CONFIG.current;
    const COLLECTION_NAME = `items_${APP_CONFIG.theme}`;

    // ✅ Real-time тыңдау
    useEffect(() => {
        setIsLoading(true);
        hasSeeded.current = false;

        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            async (snapshot) => {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // ✅ Егер бос болса — бастапқы деректерді қосу
                if (items.length === 0 && !hasSeeded.current) {
                    hasSeeded.current = true;
                    await seedInitialData();
                    return;
                }

                setOrders(items);
                setIsLoading(false);
            },
            (error) => {
                console.error('❌ Firestore error:', error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [APP_CONFIG.theme]);

    // ✅ Бастапқы деректерді қосу
    const seedInitialData = async () => {
        try {
            const initialItems = config.initialItems;

            for (const item of initialItems) {
                await addDoc(collection(db, COLLECTION_NAME), {
                    title: item.title,
                    description: item.description,
                    value: item.value,
                    category: item.category,
                    status: 'Күтілуде',
                    date: serverTimestamp(),
                });
            }

            console.log('✅ Бастапқы деректер қосылды:', COLLECTION_NAME);
        } catch (error) {
            console.error('❌ Seed error:', error);
        }
    };

    // ✅ Қосу
    const addOrder = async (order) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...order,
                date: serverTimestamp(),
            });
            console.log('✅ Қосылды:', docRef.id);
            return { id: docRef.id, ...order };
        } catch (error) {
            console.error('❌ Add error:', error);
            throw error;
        }
    };

    // ✅ Өзгерту
    const updateOrder = async (id, updates) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);
            console.log('✅ Өзгертілді:', id);
        } catch (error) {
            console.error('❌ Update error:', error);
            throw error;
        }
    };

    // ✅ Өшіру
    const deleteOrder = async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
            console.log('✅ Өшірілді:', id);
        } catch (error) {
            console.error('❌ Delete error:', error);
            throw error;
        }
    };

    // ✅ Статистика
    const getStats = () => {
        const total = orders.length;
        const revenue = orders.reduce((sum, o) => sum + (o.value || 0), 0);
        const delivered = orders.filter(o => o.status === 'Жеткізілді').length;
        const inProgress = orders.filter(o => o.status === 'Жолда').length;
        const pending = orders.filter(o => o.status === 'Күтілуде').length;

        return {
            total,
            revenue,
            delivered,
            inProgress,
            pending,
            avgPrice: total > 0 ? Math.round(revenue / total) : 0,
        };
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            isLoading,
            addOrder,
            updateOrder,
            deleteOrder,
            getStats,
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export const useOrders = () => useContext(OrdersContext);